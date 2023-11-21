import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// for whole app to work with currencies
export function formatPrice (
  price:number |string,
  options: {
    currency?:"USD" | "EUR" | "GBP" | "CZK",
    notation?: Intl.NumberFormatOptions["notation"]
  }={}
){
  // set default values for options
  const {currency="USD", notation = "compact"} = options
  
  //check if price is number
  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US",{
    style: "currency",
    currency,
    notation,
    maximumFractionDigits:2,
  }).format(numericPrice)
}
