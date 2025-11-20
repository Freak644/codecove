import { useEffect, useRef } from "react";
import { toggleABMenu } from "../lib/toggleTheme";
import { Link } from "react-router-dom";
import {getColor} from '../utils/getGradnt';
export default function AbsoluteMenu() {
    let mainRef = useRef();
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);

    useEffect(() => {
        const menuDiv = document.querySelector(".absoluteMenu");
        if (!menuDiv) return;

        if (isMenuToggling) {
            menuDiv.classList.add("activeAbMenu");
        } else {
            menuDiv.classList.remove("activeAbMenu");
        }
    }, [isMenuToggling]);

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
                isMenuToggling &&
                mainRef.current &&
                !mainRef.current.contains(evnt.target) &&
                tmpArray.length === 0
            ) {
                toggleMenu(false);
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [isMenuToggling]);

    return(
        <div ref={mainRef} className="absoluteMenu z-99  absolute flex top-[9vh] h-[90vh] items-center justify-center flex-wrap
        p-4 -left-[350px] opacity-0 transition-all duration-500 bg-blue-800/10 backdrop-blur-lg w-3xs">
             <div className="Logotxt sticky top-0 flex items-center mt-3.5! flex-col w-[120px]">
                <i className={`bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${getColor()}
                bg-clip-text text-transparent
                `}></i>
                <h2 className={`font-bold text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${getColor()}
                bg-clip-text text-transparent`}>CodeCove</h2>
            </div>
            <div className="AbMenuDiv my-scroll w-full h-4/5 my-scroll 
            flex items-center flex-col text-lg text-skin-text">
                <ul>
                    <li>
                        <Link to="/DashBord">
                        <i className="bx bxs-dashboard"></i>
                        <span>Dashbord</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}