import { useEffect, useState } from "react"
import { AltMail, CodeBlockI, ExploreIcon, FileSvg, HomeIcon, MeneHI } from "../utils/SVG/menuSVG";
import { GradientSVG } from "../utils/getSVG";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import { toggleABMenu } from "../lib/toggleTheme";
import { Calnder, ChatIcon, CodeBlock, dbLsmUser, dbLuser, FireSvg } from "../utils/SVG/TODOsvg";
import MenuLICon from "./miniCom/liContainer";
import { NotificationBellIcon } from "../utils/SVG/SVG";

export default function WindowsMenu ({userInfo}) {
    const [crntTab, setTab] = useState('Home');
    const [isHidden, setHidden] = useState(false);
    const crntLocation = useLocation();
    let {toggleMenu} = toggleABMenu();

    const discoverLiArray = [
        {
            expPath:"Explore",
            pTxt:"Discover people & projects",
            svgCom:ExploreIcon,
            svgClass:"svgAnim svgAnimR",
            isDot:true
        },
        {
            expPath:"Trending",
            pTxt:"What's hot in dev",
            svgCom:FireSvg,
            isDot:true
        },
        {
            expPath:"Projects",
            pTxt:"Open Source & side projects",
            svgCom:CodeBlock
        },
        {
            expPath:"Articles",
            pTxt:"Read & share knowledge",
            svgCom:FileSvg
        },
        {
            expPath:"Events",
            pTxt:"Meetups & hackathons",
            svgCom:Calnder
        }
    ];

    const connectLiArray = [
        {
            expPath:"Network",
            pTxt:"Find & connect developers",
            svgCom:dbLuser
        },
        {
            expPath:"Communities",
            pTxt:"Join dev communmities",
            svgCom:dbLsmUser
        },
        {
            expPath:"Developers",
            pTxt:"Discover developers",
            svgCom:CodeBlock
        },
        {
            expPath:"Mesages",
            pTxt:"Chats & conversations",
            svgCom:ChatIcon,
            count:"10+"
        }
    ]

    const notificationsLiArray = [
        {
            expPath:"Notification",
            pTxt:"Activity & updates",
            svgCom:NotificationBellIcon,
            count:5
        },
        {
            expPath:"Mentions",
            pTxt:"Replies & mentions",
            svgCom:AltMail,
            count:1
        }
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
                <p className="text-[11px] h-1/10 font-bold text-indigo-500 p-2">DISCOVER</p>
                <ul className="h-9/10!">
                    {
                        discoverLiArray.map((info,index) => (
                            <MenuLICon key={index} crntTab={crntTab} crntLiInfo={info} />
                        ))
                    }
                    <div className="border-b w-full h-px border-gray-500/15"/>
                </ul>
            </div>

            <div className="containerBigbos h-3/12 w-full">
                    <p className="text-[11px] h-1/10 font-bold text-sky-500 pl-2">CONNECT</p>
                    <ul className="h-9/10!">
                        {
                            connectLiArray.map((info,index) => (
                                <MenuLICon key={index} crntTab={crntTab} crntLiInfo={info} />
                            ))
                        }
                        <div className="border-b w-full h-px border-gray-500/15"/>
                    </ul>
            </div>

            <div className="containerBigbos h-2/14 w-full">
                    <p className="text-[11px] h-1/10 font-bold text-green-500 pl-2">NOTIFICATIONS</p>
                    <ul className="h-9/10! mt-0.5">
                        {
                            notificationsLiArray.map((info,index) => (
                                <MenuLICon key={index} crntTab={crntTab} crntLiInfo={info} />
                            ))
                        }
                        <div className="border-b w-full h-px border-gray-500/15"/>
                    </ul>
            </div>

            <div className="containerBigbos bg-indigo-600/10 rounded-lg h-1/11 w-full border border-cyan-500/10
            flex items-center justify-center gap-1.5">
                    <div className="imgDiv h-14 w-14 relative">
                        <img src={userInfo.avatar+"?size=56"} className="h-full w-ful rounded-full" alt="" />
                        <div className="greenDot bg-green-700 h-2 w-2 bottom-1 right-1 absolute rounded-full"/>
                    </div>
                    <div className="w-3/4 text-skin-text text-[10px] h-full 
                    flex items-center flex-row gap-1">
                        <div className="flex-1 gap-1! flex items-start h-full flex-col">
                            <p>John Deo</p>
                            <p className="text-skin-ptext/70">@loser_3221</p>
                            <p className="text-skin-ptext/70">Developer</p>
                        </div>
                        <div className="flex-2 h-full flex items-center flex-col gap-0.5">
                            <div className="h-1/2 flex w-full">
                                <p className="flex-1 flex items-center flex-col h-full">
                                    1.2k <span className="text-skin-ptext/70">Followers</span>
                                </p>
                                <p className="flex-1 flex items-center flex-col h-full">
                                    50 <span className="text-skin-ptext/70">Following</span>
                                </p>
                            </div>
                            <button className="w-full h-6 bg-sky-800/10 rounded-lg border
                            border-gray-500/30 shadow cursor-pointer">View Profile</button>
                        </div>
                    </div>
            </div>

            <div className="containerBigbos border-t-indigo-600 border-l-indigo-600 border-sky-500/35
            rounded-lg mt-1 h-1/19 border-2 w-full flex items-center justify-center text-indigo-600">
                + Create post
            </div>
        </>
    )
}