import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import ThemeButton from '../components/toggleButton.jsx';
import { UnivuUserInfo } from '../lib/basicUserinfo.js';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import MenuSkeleton from './menuSkel';
import { toggleABMenu } from '../lib/toggleTheme';
import {getColor} from '../utils/getGradnt.js';
export default function MenuEL(params) {
    let gradColor = getColor();
    const [currentTab,setTab] = useState('Home');
    const [userinfo,setUserInfo] = useState({});
    const [isDD,setDD] = useState(false);
    const [isHidden,setHidden] = useState(false)
    const {setInfo} = UnivuUserInfo();
    const dropRef = useRef();
    const navi = useNavigate();
    const crntLocation = useLocation();
    const toggleMenu = toggleABMenu(state=>state.toggleMenu);
    useEffect(()=>{
        getUserInfo();
    },[])
    const getUserInfo = async () => {
        try {
            let rkv = await fetch("/myServer/getUserInfo")
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
        let rqst = await fetch("/myServer/Logout",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST",
        })
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

    return(
        <>
        {userinfo.avatar?.length < 2 ? <MenuSkeleton/> : <div className="menuDiv transition-all duration-700 relative left-0 border-r  h-[91vh] border-gray-400 lg:h-[93.5vh] w-[13vw]
        flex items-center flex-col gap-5
         z-20
        "> <p id='secBtn' onClick={()=>setHidden(prev=>!prev)} className="h-8 w-8 flex logotxt items-center justify-center text-2xl cursor-pointer border-skin-ptext/30 border rounded-full absolute top-3 -right-2"><i className="bx bx-menu text-skin-ptext"></i></p>
            <div className="Logotxt flex items-center lg:mt-3.5! flex-col w-30">
                <i className={`bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${gradColor}
                bg-clip-text text-transparent
                `}></i>
                <h2 className={`font-extrabold! text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${gradColor}
                bg-clip-text text-transparent`}>CodeCove</h2>
            </div>
            <div className='menuContainer relative flex items-center flex-col gap-10 lg:text-[18px] sm:text-2xl text-skin-text'>
                <ul className='topU flex items-start flex-col gap-3 border-b-2 border-gray-400 my-scroll'>
                    <li>
                        <Link to="/">
                        <i className={`bx ${currentTab === 'Home' ? "bxs" : "bx"}-home text-skin-text`}></i>
                        <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Explore">
                        <i className={`bx ${currentTab === 'Explore' ? "bxs" : "bx"}-compass text-skin-text`}></i>
                        <span className='flex items-center'>Explore</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Search">
                        <i className={`bx ${currentTab === 'Search' ? "bxs" : "bx"}-search text-skin-text`}></i>
                        <span>Search</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Chat">
                        <i className={`bx ${currentTab === 'Chat' ? "bxs" : "bx"}-chat text-skin-text`}></i>
                        <span>DM</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Commit" title='Commit Your thought'>
                        <i className={`bx ${currentTab === 'Commit' ? "bxs" : "bx"}-plus-circle text-skin-text`}></i>
                        <span>Commit</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Notifications">
                        <i className={`bx ${currentTab === 'Notification' ? "bxs" : "bx"}-bell text-skin-text`}></i>
                        <span>Alert</span>
                        </Link>
                    </li>

                    <li>
                        <Link to={`/Lab/${userinfo?.username}`}>
                        <div className='h-8 w-8 md:h-9 md:w-9 border rounded-full flex items-center justify-center'>
                            <img
                            className='h-full rounded-full w-full'
                            src={userinfo.avatar?.length > 5 ? `/myServer/${userinfo.avatar}` : "https://i.postimg.cc/7ZTJzX5X/icon.png"}
                            alt=""
                            />
                        </div>
                        <span>My Lab</span>
                        </Link>
                    </li>
                    </ul>
                <ul className='secul flex items-start justify-start flex-wrap gap-5'>
                    <li ref={dropRef} onClick={()=>{setDD(prev=>!prev)}} className='relative'><i className='bx bx-menu'></i><span>Settings</span>
                    {isDD && <div onClick={(evnt)=>evnt.stopPropagation()} className="dropdownMenu flex items-center flex-col rounded-2xl w-50 h-60 bg-skin-bg my-scroll my-scroll-visible">
                        <ul className='flex gap-2 flex-col'>
                            <li><i className='bx bx-cog'></i><span>Setting</span></li>
                            <li><i className='bx bx-chart'></i><span>Your Activity</span></li>
                            <li className='z-50 flex items-center p-0! mb-3'> <ThemeButton/> </li>
                            <li><i className='bx bx-bookmark'></i><span>Save</span></li>
                            <li><i className='bx bx-error-circle'></i><span className='flex items-center justify-center z-20'>Report an issue</span></li>
                            <li onClick={handleLogout}><i className='bx bxs-log-in'></i><span>Logout</span></li>
                        </ul>
                    </div>}
                    </li>
                    <li ><i className='bx bx-menu-alt-left'></i><span>Tools</span></li>
                </ul>
            </div>
        </div>}
        </>
    )
}