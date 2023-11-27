import {publicProcedure,router} from "./trpc"
import { authRouter } from './auth-router'
import { z } from "zod"
import { QueryValidator } from "../lib/validators/query-validator"
import { getPayloadClient } from "../get-payload"

export const appRouter = router({
    auth: authRouter,
    getInifiniteProducts: publicProcedure.input(z.object({
        limit:z.number().min(1).max(100),
        cursor:z.number().nullish(), // last elemnt that was rendered
        query: QueryValidator,
    })).query(async({input})=>{
        const {query,cursor} = input
        const {sort,limit,...queryOpts} = query

        const payload = await getPayloadClient()

        // i can put as many queryOpts as i want
        const parsedQueryOpt: Record<string, {equals:string}> = {}
        Object.entries(queryOpts).forEach(([key,value])=>{
            parsedQueryOpt[key]={
                equals:value,
            }
        })

        const page = cursor || 1

        const {docs:items, hasNextPage, nextPage} = await payload.find({
            collection:"products",
            where:{
                approvedForSale:{
                    equals:"approved"
                },
                ...parsedQueryOpt,// these looks same as approvedForSale
            },
            sort,
            depth:1,
            limit,
            page,
        })

        return {
            items,
            nextPage: hasNextPage ? nextPage :null
        }
    }),
})

export type AppRouter = typeof appRouter
