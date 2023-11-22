  import {z} from "zod"
  
  export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator >
  
  export const AuthCredentialsValidator = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message:"Passwod must be at least 8 characters long."})
  })