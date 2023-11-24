import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { CollectionConfig } from "payload/types";


const addUser:BeforeChangeHook = ({req,data})=>{
    const user = req.user as User | null
    return {...data, user: user?.id}
}

export const ProductFiles : CollectionConfig = {
    slug:"product_files",
    admin:{
        hidden: ({user})=> user.role !== "admin",
    },
    hooks:{
        beforeChange:[addUser],
    },
    access:{
        read:yourOwnAndPurchased
    },
    upload:{
        staticURL: "/product_files",
        staticDir: "/product_files",
        mimeTypes: ["/image/*","font/*","application/postscripts"]
    },
    fields: [
        {
            name:"user",
            type: "relationship",
            relationTo: "users",
            admin:{
                condition: () => false
            },
            hasMany:false,
            required: true,
        }
    ]
}