"use client"
import React from 'react'
import { trpc } from "@/trpc/client"
import {XCircle,Loader2} from " lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button";



interface VerifyEmailProps {
    token: string;
}

const VerifyEmail = ({token}: VerifyEmailProps) => {
    const {data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({token})

    if(isError){
          return (
            <div className = "flex flex-col items-center gap-2">
                <XCircle className="w-8 h-8 text-red-600"/>
                <h3 className="font-semibold text-xl">There was a problem.</h3>
                <p className="text-muted-foreground tetx-sm">This token is not valid or might be expired. Please try again.</p>
            </div>
        )
    }

    if(data?.success){
        return(
            <div className = "flex h-full flex-col items-center justify-center">
                <div className="relative mb-4 h-60 w-60 text-muted-foreground">
                    <Image src="/hippo-sent-email.jpg" fill alt="The email was sent"/>
                </div>
                <h3 className="font-semibold text-2xl">Your&apos;re all set.</h3>
                <p className="text-muted-foreground tetx-center mt-1 text-sm">Thank you for verifying your email.</p>
                <Button asChild className="mt-4">
                    <Link href="/sign-in" className=""></Link>
                </Button>
            </div>
        )
    }

    if(isLoading){
        return (
            <div className = "flex flex-col items-center gap-2">
                <Loader2 className="animate-spin w-8 h-8 text-zinc-300"/>
                <h3 className="font-semibold text-xl">Verifying...</h3>
                <p className="text-muted-foreground tetx-sm">This won&apos;t take long.</p>
            </div>
        )
    }
}

export default VerifyEmail
