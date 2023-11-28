// custom hook to add items,
// remove items,
//clear the cart,
//keep track of cart items

import {create} from "zustand"
import {Product} from "@/payload-types"
import {createJSONStorage, persist} from "zustand/middleware"

export type CartItem = {
    product: Product
}

type CartState={
    items:CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set)=>({
            items:[],
            addItem:(product) => set((state)=>{
                return {items:[...state.items,{product}]}
            }),
            removeItem: (id)=>set((state)=>({
                items:state.items.filter((item)=> item.product.id !== id)
            })),
            clearCart:()=> set({items:[]})
        }),
        {//config object
            name:"cart-storage",
            storage:createJSONStorage(()=> localStorage),
        }
    )
)
    