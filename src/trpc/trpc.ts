import {initTRPC} from "@trpc/server"

const t = initTRPC.context().create()

export const router = t.router

//this one is public endpoint
export const publicProcedure = t.procedure