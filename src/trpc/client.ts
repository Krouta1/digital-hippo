import { createTRPCReact } from "@trpc/react-query";
import type AppRouter from "./index"

// this with type is to ensure the frontend knows types of backend, it will come handy
export const trpc = createTRPCReact<AppRouter>({})