import { useEffect, useRef, useState } from "react";
import React from "react";

export default function AbsoluteMenu({menuRef,setRef}) {
    let mainRef = useRef();

    useEffect(() => {
        const menuDiv = document.querySelector(".absoluteMenu");
        if (!menuDiv) return;

        if (menuRef) {
            menuDiv.classList.add("activeAbMenu");
        } else {
            menuDiv.classList.remove("activeAbMenu");
        }
    }, [menuRef]);

    useEffect(() => {
        const handleClick = (evnt) => {
            let tmpArray = [];
         let menuBTNS = document.querySelectorAll(".menuBTN")
            if (!menuBTNS) return;
            menuBTNS.forEach(btn=>{
                if (btn.contains(evnt.target)) {
                    tmpArray.push(btn)
                }
            })
            if (
                menuRef &&
                mainRef.current &&
                !mainRef.current.contains(evnt.target) &&
                tmpArray.length === 0
            ) {
                setRef(false)
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [menuRef]);
    return(
        <div ref={mainRef} className="absoluteMenu z-99  absolute flex top-[9vh] h-[90vh] items-center justify-center flex-wrap
        p-4 -left-[350px] opacity-0 transition-all duration-500 bg-blue-800/10 backdrop-blur-lg w-3xs">
             <div className="Logotxt sticky top-0 flex items-center mt-3.5! flex-col w-[120px]">
                <i className='bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr from-purple-500 via-yellow-500 to-blue-600
                bg-clip-text text-transparent
                '></i>
                <h2 className='font-bold text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr from-purple-500 via-yellow-500 to-blue-600
                bg-clip-text text-transparent'>CodeCove</h2>
            </div>
            <div className="AbMenuDiv my-scroll w-full h-4/5 my-scroll 
            flex items-center flex-col">
                <ul>
                    <li><i className="bx bxs-dashboard"></i><span>Dashbord</span></li>
                </ul>
            </div>
        </div>
    )
}