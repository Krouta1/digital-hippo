"use client";
import React, { useState, useRef, useEffect } from "react";
import NavItem from "./NavItem";
import { PRODUCT_CATEGORIES } from "../config";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface Props {}

const NavItems = (props: Props) => {
  //state for indexes
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  // if activeIndex !== null i know there is opedned category
  const isAnyOpen = activeIndex !== null;

  // if user clicks outside nav, it should close, laso hook is from internet :)
  const navRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(navRef, () => setActiveIndex(null));

  //if user press escape it should close nav too :)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);
    return () => {// simple clean-up
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((cat, index) => {
        const handleOpen = () => {
          // to track wich item in navbar is open
          console.log(activeIndex);
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };

        //it is opend when index of mapped item is activeIndex
        const isOpen = index === activeIndex;

        return (
          <NavItem
            key={cat.value}
            category={cat}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
