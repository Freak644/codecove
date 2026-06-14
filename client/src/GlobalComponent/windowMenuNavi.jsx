import { useEffect, useState } from "react"
import { CodeBlockI, ExploreIcon, HomeIcon, MeneHI } from "../utils/SVG/menuSVG";
import { GradientSVG } from "../utils/getSVG";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import { toggleABMenu } from "../lib/toggleTheme";
import { CodeBlock, FireSvg } from "../utils/SVG/TODOsvg";
import MenuLICon from "./miniCom/liContainer";

export default function WindowsMenu () {
    const [crntTab, setTab] = useState('Home');
    const [isHidden, setHidden] = useState(false);
    const crntLocation = useLocation();
    let {toggleMenu} = toggleABMenu();

    const liArray = [
        {
            expPath:"Explore",
            pTxt:"Discover people & projects",
            svgCom:<ExploreIcon className="svgAnim svgAnimR" />
        },
        {
            expPath:"Trending",
            pTxt:"What's hot in dev",
            svgCom:<FireSvg className="svgAnim" />
        },
        {
            expPath:"Projects",
            pTxt:"Open Source & side projects",
            svgCom:<CodeBlock className="svgAnim"/>
        },
        // {
        //     expPath:"Articles",
        //     pTxt:"Read & share knowledge"
        // },
        // {
        //     expPath:"Events",
        //     pTxt:"Meetups & hackathons"
        // }
    ]

    useEffect(()=>{
            toggleMenu(false)
            let crntRoute = crntLocation.pathname.split("/")
            if (!crntRoute[1].trim()) {
                return setTab("Home")
            }
            setTab(crntRoute[1])
    },[crntLocation.pathname])

    useEffect(()=>{
            let routeContainer = document.querySelector('.routeContainer')
            let menuDiv = document.querySelector('.menuDiv')
            if (!routeContainer ||
                !menuDiv
            ) {
                return
            }
            if (isHidden) {
                routeContainer.classList.add('hideMenu');
                menuDiv.classList.add('hideMenu')
            }else{
                routeContainer.classList.remove('hideMenu');
                menuDiv.classList.remove('hideMenu')
            }
        },[isHidden])

    return(
        <>
            <p id="secBtn" onClick={()=> {setHidden(prev=>!prev)}} className="h-8 w-8 flex logotxt items-center justify-center text-2xl cursor-pointer
            border-skin-ptext/30 border rounded-full absolute top-3 -right-2">
                <MeneHI className={`text-skin-ptext ${isHidden && "rotate-180"}`}/>
            </p>
            <div className="topIconDiv h-[6%]  flex items-center justify-start w-full gap-1.5">
                <div className="Logotxt ml-1.5">
                    <GradientSVG id={"menu"} />
                    <CodeBlockI className="h-8 w-10" style={{fill: "url(#menu)"}}  />
                </div>
                <div className="textMD text-skin-text mt-2">
                    <p>EchoVain's</p>
                    <p className="text-skin-ptext text-[8px]">Code. Connect. Create.</p>
                </div>
            </div>

            <div className="containerBigBos h-[6%] w-full
            text-skin-text">
                <ul>
                    <li className={crntTab === "Home" ? "activeLiContainer" : ""}>
                        <Link to="/">
                            <HomeIcon className="svgAnim"/>
                                <span>Home</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="containerBigbos h-3/10 w-full">
                <p className="text-[11px] h-1/10 font-bold text-purple-800">DISCOVER</p>
                <ul className="h-9/10!">
                    {
                        liArray.map((info,index) => (
                            <MenuLICon crntTab={crntTab} crntLiInfo={info} />
                        ))
                    }
                </ul>
            </div>
        </>
    )
}