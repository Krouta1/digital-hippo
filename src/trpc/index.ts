import {publicProcedure,router} from "./trpc"
import {authRouter} from "./trpc"

export const appRouter = router({
    auth: authRouter
})

export type AppRouter = typeof appRouter
