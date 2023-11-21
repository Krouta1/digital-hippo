"use client"
import React,{useState} from 'react'

import NavItem from "./NavItem"
import { PRODUCT_CATEGORIES } from '../config'

interface Props {
    
}



const NavItems = (props: Props) => {
    //state for indexes
    const [activeIndex, setActiveIndex] = useState<null | number>(null)

    // if activeIndex <> null i know there is opedned category
    const isAnyOpen = activeIndex !== null

    return (
        <div className="flex gap-4 h-full">
            {PRODUCT_CATEGORIES.map((cat,index)=>{
                const handleOpen = () => { // to track wich item in navbar is open
                    console.log(activeIndex)
                    if(activeIndex === index){
                        setActiveIndex(null)
                    }else{
                        setActiveIndex(index)
                    }
                }

                //it is opend when index of mapped item is activeIndex
                const isOpen = index === activeIndex

                return(
                    <NavItem key={cat.value} category={cat} handleOpen={handleOpen} isOpen={isOpen} isAnyOpen={isAnyOpen}/>
                )
            })}
        </div>
    )
}

export default NavItems
