import { publicProcedure, router } from "./trpc";
import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({input}) => { //mutation for changing data
      const { email, password } = input;
      const payload = await getPayloadClient();

      //check if user exists
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" });

      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
  }),


  verifyEmail: publicProcedure
    .input(z.object({token: z.string()}))
    .query( async({input})=>{ // i am not changing anything so just query :)
      const {token} = input
      const payload = await getPayloadClient();

      isVerified = await.payload.verifyEmail({
        collection: "users",
        token,
      })

      if(!isVerified) throw new TRPCError({code:"UNAUTHORIZED"})

      return { success: true };
  }),


  signIn:publicProcedure
    .input(AuthCredentialsValidator)
    .mutation( async({input,ctx})=>{
      const {email,password} = input
      const {res} = ctx // this is to get token of user session, when he logs in
      const payload = await getPayloadClient();


      try {
        await payload.login({
          collection:"users",
          data:{
            email,
            password,
          },
          res,
        })
        return {success:true}
      } catch (error) {
        throw new TRPCError({code:"UNAUTHORIZED"})
      }
    })
});
