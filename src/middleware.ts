import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

export default async function  middlware(req:NextRequest) {
    const {nextUrl,cookies}=req
    const {user} =await getServerSideUser(cookies)

    if(user && ["/sig-in","sign-up"].includes(nextUrl.pathname)){
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}`)
    }

    return NextResponse.next()
}