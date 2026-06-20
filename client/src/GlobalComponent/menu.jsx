import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import ThemeButton from '../components/toggleButton.jsx';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MenuSkeleton from './menuSkel';
import { toggleABMenu } from '../lib/toggleTheme';
import {getColor} from '../utils/getGradnt.js';
import MiniMenu from './miniNavigation.jsx';
const MeneUI = lazy(()=> import("./windowMenuNavi.jsx"));

import { UnivuUserInfo } from '../lib/basicUserinfo.js';
import { debouncerGlob } from '../utils/debounceFun.js';
import { ExploreIcon, HomeIcon, SearchIcon } from '../utils/SVG/menuSVG.jsx';
export default function MenuEL(params) {
    let gradColor = getColor();
    const [currentTab,setTab] = useState('Home');
    const [isDD,setDD] = useState(false);
    const [isHidden,setHidden] = useState(false)
    let {userInfo} = UnivuUserInfo();
    const dropRef = useRef();
    const navi = useNavigate();
    const [miniMenu, setMenu] = useState(false);
    const crntLocation = useLocation();
    const toggleMenu = toggleABMenu(state=>state.toggleMenu);

 
    const handleLogout = async () => {
        let rqst = await fetch("/myServer/user/Logout")
        let result = await rqst.json();
        // console.log(result)
        if (result.pass) {
           location.reload()
            navi('/')            
        }
    }
    useEffect(()=>{
        toggleMenu(false)
        let crntRoute = crntLocation.pathname.split("/")
        if (!crntRoute[1].trim()) {
            return setTab("Home")
        }
        setTab(crntRoute[1])
    },[crntLocation.pathname])

    useEffect(()=>{
        const handleClick = evnt=> {
            if (dropRef.current && !dropRef.current.contains(evnt.target)) {
                setDD(false)
            }
        }

        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click",handleClick)
    },[])

    useEffect(()=>{
        if (window.innerWidth <= 600) {
            setMenu(true);
        } else {
            setMenu(false);
        } 
    },[])

    const debounceLogout = useMemo(()=>{
        return debouncerGlob(handleLogout)
    },[])

    return(
        <div className={`${miniMenu ? "mobileMenu" : "menuDiv"}  backdrop-blur-lg bg-purple-950/10 no-copy
        duration-500 relative left-2 sm:border h-[91vh] border-gray-600/15
        lg:h-[93vh] w-[17vw] flex items-center flex-col gap-1 z-20 my-scroll`}>
            { !miniMenu && <Suspense fallback={<MenuSkeleton/>} >
                <MeneUI userInfo={userInfo} miniMenu={miniMenu} />
            </Suspense>}
            {miniMenu && <Suspense fallback={<div/>} >
                    <MiniMenu avatar={userInfo.avatar} crntTab={currentTab} username={userInfo.username}/>
                </Suspense>
            }
        </div>
    )
}