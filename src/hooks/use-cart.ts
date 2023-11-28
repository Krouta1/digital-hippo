// custom hook to add items,
// remove items,
//clear the cart,
//keep track of cart items

import {create} from "zustand"
import {Product} from "@/payload-types"

export type CartItem = {
    product: Product
}

type CartState={
    items:CartItem;
    addItem: (product: Product) => void;
    removeItem: (productId: Product) => void;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    
)