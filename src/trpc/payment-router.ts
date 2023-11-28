import {  z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../get-payload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
    createSession: privateProcedure.input(z.object({
        productIds: z.array(z.string())
    })).mutation(async({ctx,input})=>{
        const {user} = ctx
        let{productIds} = input

        if(productIds.length === 0){
            throw new TRPCError({code: "BAD_REQUEST"})
        }

        const payload = await getPayloadClient()

        //get products
        const { docs:products } = await payload.find({
            collection: "products",
            where:{
                id:{
                    in:productIds,
                },
            },
        })

        //if it has price i can use it in stripe
        const filteredProducts = products.filter((prod)=> Boolean(prod.priceId))

        //create an order
        const order = await payload.create({
            collection: "orders",
            data:{
                _isPaid:false,
                products: filteredProducts,
                user: user.id,
            }
        })

        //define items that are send to stripe
        const line_items:Stripe.Checkout.SessionCreateParams.LineItem[] = []
        
        //pushing items in cart
        filteredProducts.forEach((product)=>{
            line_items.push({
                price:product.priceId!,
                quantity:1,
            })
        })

        //pushing transaction fee
        line_items.push({
            price:"price_1OHWvtAcihk59JjwY6QXJUHS",
            quantity:1,
            adjustable_quantity:{
                enabled:false
            }
        })

        //try to check out with stripe
        try {
            const stripeSession = await stripe.checkout.sessions.create({
                success_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
                cancel_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
                payment_method_types:["card","paypal","revolut_pay"],
                mode:"payment",
                metadata:{
                    userId: user.id,
                    orderId: order.id,
                },
                line_items,
            })

            return {url:stripeSession.url}
        } catch (error) {
            console.log(error)
            return { url: null}
        }

    }),
})