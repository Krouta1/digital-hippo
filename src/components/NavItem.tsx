"use client"
import React from 'react'

import {ChevronDown} from "lucide-react"
import { PRODUCT_CATEGORIES } from '../config';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

type Category =  typeof PRODUCT_CATEGORIES[number]

interface NavbarItemProps {
   category:Category;
   handleOpen:()=>void;
   isOpen:boolean; 
   isAnyOpen:boolean; 
}

const NavItem = ({category,handleOpen,isOpen,isAnyOpen}: NavbarItemProps) => {
    return (
        <div className="flex">
            <div className="relative flex items-center">
                <Button className="gap-1.5" onClick={handleOpen} variant={isOpen ? "secondary" : "ghost"}>
                    {category.label}
                    <ChevronDown className={cn("h-4 w-4 transition-all text-muted-foreground",{
                        "-rotate-180" : isOpen,
                    })}/>
                </Button>
            </div>
            {isOpen ? (
                <div className={cn("absolute inset-x-0 top-full text-sm text-muted-foregroud",{
                    "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen
                })}>
                    <div className="relative bg-white">
                        <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                                    {category.featured.map((item)=>(
                                        <div></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"/>
                </div> 
            ) : null}
        </div>
    )
}

export default NavItem
