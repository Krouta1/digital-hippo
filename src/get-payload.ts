import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer"

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


//this is for sending verification email
const transporter = nodemailer.createTransport({
  host:"smtp.resend.com",
  secure: true,
  port: 465,
  auth:{
    user:"resend",
    pass: process.env.RESEND_API_KEY
  },
  tls: {
    rejectUnauthorized: false
  }
})

// use caching
let cached = (global as any).payload;

// if not cached create one
if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({ initOptions }: Args={}):Promise<Payload> => {
    if(!process.env.PAYLOAD_SECRET!){
        throw new Error("PAYLOAD_SECRET is missing!")
    }
    if(cached.client){
        return cached.client
    }
    if(!cached.promise){
        cached.promise = payload.init({
          email:{
            transport: transporter,
            fromAddress: "onboarding@resend.dev",
            fromName:"DigitalHippo",
          },
          secret:process.env.PAYLOAD_SECRET!,
          local:initOptions?.express ? false : true,
          ...(initOptions || {}) // put everything else in :)
        })
    }

    try {
        cached.client = await cached.promise
    } catch (error:unknown) {
        cached.promise = null
        throw error
    }

    return cached.client
};

// this is basicly database client ;)
