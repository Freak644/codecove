import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import ThemeButton from '../components/toggleButton.jsx';
import { UnivuUserInfo } from '../lib/basicUserinfo.js';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MenuSkeleton from './menuSkel';
import { toggleABMenu } from '../lib/toggleTheme';
import {getColor} from '../utils/getGradnt.js';
import MiniMenu from './miniNavigation.jsx';
import { IoMdMenu } from "react-icons/io";
import { FaLaptopCode } from 'react-icons/fa';
import { GradientSVG } from '../utils/getSVG.jsx';
import { MdHome, MdExplore, MdSearch, MdNotificationsActive, MdAppSettingsAlt, MdSettings, MdBarChart, MdReportProblem, MdLogout } from "react-icons/md";
import { HiChatAlt2 } from "react-icons/hi";
import { RiGitRepositoryCommitsFill } from "react-icons/ri";
import { FaTools } from "react-icons/fa";
export default function MenuEL(params) {
    let gradColor = getColor();
    const [currentTab,setTab] = useState('Home');
    const [userinfo,setUserInfo] = useState({});
    const [isDD,setDD] = useState(false);
    const [isHidden,setHidden] = useState(false)
    const {setInfo} = UnivuUserInfo();
    const dropRef = useRef();
    const navi = useNavigate();
    const [miniMenu, setMenu] = useState(false);
    const crntLocation = useLocation();
    const toggleMenu = toggleABMenu(state=>state.toggleMenu);
    useEffect(()=>{
        getUserInfo();
    },[])
    const getUserInfo = async () => {
        try {
            let rkv = await fetch("/myServer/user/getUserInfo")
            let result = await rkv.json();
            if (result.err) {
                throw new Error(result.err);
                } else if (result.login) {
                    sessionStorage.clear();
                    location.reload()
                }
                setUserInfo(result.userinfo[0])
                setInfo(result.userinfo[0])
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleLogout = async () => {
        let rqst = await fetch("/myServer/user/Logout")
        let result = await rqst.json();
        console.log(result)
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

    useEffect(()=>{
        if (window.innerWidth <= 600) {
            setMenu(true);
        } else {
            setMenu(false);
        } 
    },[])

    return(
        <>
        {userinfo.avatar?.length < 2 ? <MenuSkeleton/> : <div className="menuDiv transition-all duration-700 relative left-0 sm:border-r  h-[91vh] border-gray-400 lg:h-[93.5vh] w-[13vw]
        flex items-center flex-col gap-5
         z-20
        "> <p id='secBtn' onClick={()=>setHidden(prev=>!prev)} className="h-8 w-8 flex logotxt items-center justify-center text-2xl cursor-pointer border-skin-ptext/30 border rounded-full absolute top-3 -right-2"><IoMdMenu className='text-skin-ptext'/></p>
            <div className="Logotxt flex items-center lg:mt-3.5! flex-col w-30">
                <GradientSVG id={"menu"} />
                <FaLaptopCode style={{fill: "url(#menu)"}}  className="text-5xl" />
                                       
                <h2 className={`font-extrabold! text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${gradColor}
                bg-clip-text text-transparent`}>EchoNexy</h2>
            </div>
            <div className={`${miniMenu ? "miniMenu" : "menuContainer" } relative flex items-center flex-col gap-10 lg:text-[18px] sm:text-2xl text-skin-text`}>
                {!miniMenu ? <> <ul className='topU flex items-start flex-col gap-3 sm:border-b-2 border-gray-400 my-scroll'>
                    <li>
                        <Link to="/">
                        <MdHome/>
                        <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Explore">
                        <MdExplore/>
                        <span className='flex items-center'>Explore</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Search">
                        <MdSearch/>
                        <span>Search</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Chat">
                        <HiChatAlt2/>
                        <span>DM</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Commit" title='Commit Your thought'>
                        <RiGitRepositoryCommitsFill />
                        <span>Commit</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Notifications">
                        <MdNotificationsActive/>
                        <span>Alert</span>
                        </Link>
                    </li>

                    <li>
                        <Link to={`/Lab/${userinfo?.username}`}>
                        <div className='h-8 w-8 md:h-9 md:w-9 border rounded-full flex items-center justify-center'>
                            <img
                            className='h-full rounded-full w-full'
                            src={userinfo.avatar?.length > 5 ? userinfo.avatar : "https://i.postimg.cc/7ZTJzX5X/icon.png"}
                            alt=""
                            />
                        </div>
                        <span>My Lab</span>
                        </Link>
                    </li>
                    </ul>
                <ul className='secul flex items-start justify-start flex-wrap gap-5'>
                    <li ref={dropRef} onClick={()=>{setDD(prev=>!prev)}} className='relative'> <MdAppSettingsAlt/> <span>Settings</span>
                    {isDD && <div onClick={(evnt)=>evnt.stopPropagation()} className="dropdownMenu flex items-center flex-col rounded-2xl w-50 h-60 bg-skin-bg my-scroll my-scroll-visible">
                        <ul className='flex gap-2 flex-col'>
                            <li><MdSettings/><span>Setting</span></li>
                            <li><MdBarChart/><span>Your Activity</span></li>
                            <li className='z-50 flex items-center p-0! mb-3'> <ThemeButton/> </li>
                            <li><MdReportProblem/><span className='flex items-center justify-center z-20'>Report an issue</span></li>
                            <li onClick={handleLogout}><MdLogout/><span>Logout</span></li>
                        </ul>
                    </div>}
                    </li>
                    <li ><FaTools/><span>Tools</span></li>
                </ul> </> : <MiniMenu avatar={userinfo?.avatar} crntTab={currentTab} username={userinfo?.username} />
                
                }
               
            </div>
        </div>}
        </>
    )
}