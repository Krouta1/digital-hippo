"use client";
import { Icons } from "@/components/Icons";
import { buttonVariants,Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"
import {TAuthCredentialsValidator,AuthCredentialsValidator} from "@/lib/validators/account-credentials-validator"
import {trpc} from "@/trpc/client"
import {toast} from "sonner"
import { ZodError } from "zod";



const SignUpPage = () => {
  const router = useRouter()

  const { register, handleSubmit, formState:{errors} } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator)
  })

  const {mutate, isLoading} = trpc.auth.createPayloadUser.useMutation({
    onError: (err) =>{
      if(err.data?.code === "CONFLICT"){ //there is already user with this email
        toast.error("This eamil is already in use. Sign in instead?")
        return //this is to show up only one error
      }

      if(err instanceof ZodError){ // if user find the way to mess up inputs they will have correct toast
        toast.error(err.issues[0].message)
        return
      }

      // if error is something else that two cases in ifs
      toast.error("Something went wrong. Please try again.")
    },
    onSuccess:({sentToEmail})=>{
      toast.success(`Verificatin email sent to ${sentToEmail}.`)
      router.push("/verify-email?to=" + sentToEmail)
    },
  })

  const onSubmitForm =  ({email,password}:TAuthCredentialsValidator) => {
    //send data to server
    mutate({email, password})

  }

  return (
    <>
      <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Create an account</h1>
            <Link
              href={"/sign-in"}
              className={buttonVariants({
                variant: "link",
                className: "gap-1.5",
              })}
            >
              Already have an account? Sign-in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6">
            <form  onSubmit={handleSubmit(onSubmitForm)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" className={cn({
                        "focus-visible:ring-red-500": errors.email
                    })} placeholder="you@example.com" {...register("email")}/>
                    {errors?.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>
                <div className="grid gap-1 py-2">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" className={cn({
                        "focus-visible:ring-red-500": errors.password
                    })} placeholder="Password" {...register("password")}/>
                      {errors?.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>
                <Button>Sign up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
