import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ThemeButton from '../../components/toggleButton';
import { UnivuUserInfo } from '../../lib/basicUserinfo';
import { useLocation, useNavigate } from 'react-router-dom';
export default function MenuEL(params) {
    const [currentTab,setTab] = useState('');
    const [logoimg,setlogo] = useState("")
    const [isDD,setDD] = useState(false)
    const {setInfo} = UnivuUserInfo();

    const navi = useNavigate();
    const location = useLocation();
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
                setlogo(result.userinfo[0].avatar)
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
            location.reload();
            navi('/')            
        }
    }
    const handleRoutes  = evnt=>{
        let route = evnt.target.innerText;
        if (route === "Home") {
            return navi("/");
        }
        navi("/"+route);
    }
    useEffect(()=>{
        let crntRoute = location.pathname.split("/")
        if (!crntRoute[1].trim()) {
            return setTab("Home")
        }
        setTab(crntRoute[1])
    },[location.pathname])
    return(
        <div className="menuDiv   relative left-0 border-r-1  h-[91vh] border-gray-400 lg:h-[93.5vh] w-[13vw]
        flex items-center flex-col gap-5
        ">
            <div className="Logotxt flex items-center lg:!mt-3.5 flex-col w-[120px]">
                <i className='bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-[length:200%_200%]
                bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent
                '></i>
                <h2 className=' font-bold text-2xl transition-all duration-500 ease-in-out bg-[length:200%_200%]
                bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent'>CodeCove</h2>
            </div>
            <div className='menuContainer flex items-center flex-col gap-10 lg:text-[18px] sm:text-3xl text-skin-text'>
                <ul className='flex items-start flex-col gap-5  border-b-2 border-gray-400'>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}><i className={`bx ${currentTab==='Home'?"bxs":"bx"}-home text-skin-text`}></i><span>Home</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}><i className={`bx ${currentTab==='Search'?"bxs":"bx"}-search text-skin-text`}></i><span>Search</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}><i className={`bx ${currentTab==='Chat'?"bxs":"bx"}-chat text-skin-text`}></i><span>Messages</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}><i className={`bx ${currentTab==='Explore'?"bxs":"bx"}-compass text-skin-text`}></i><span>Explore</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}} className=' sm:miniLoader '><i className={`bx ${currentTab==='Create'?"bxs":"bx"}-plus-circle text-skin-text`}></i><span>Create</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}><i className={`bx ${currentTab==='Notification'?"bxs":"bx"}-bell text-skin-text`}></i><span>Notifications</span></li>
                <li onClick={(evnt)=>{handleRoutes(evnt)}}> <div className='imgDiv h-[20px] w-[20px] md:h-[30px] md:w-[30px] border rounded-full flex items-center justify-center'><img className='h-[100%] w-[100%]' src={logoimg ? `/myServer/${logoimg}` :"https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" /></div> <span>Profile</span></li>
                </ul>
                <ul className='secul flex items-start flex-col gap-5'>
                    <li onClick={()=>{setTab("none");setDD(prev=>!prev)}} className='relative'><i className='bx bx-menu'></i><span>Menu</span>
                    {isDD && <div onClick={(evnt)=>evnt.stopPropagation()} className="dropdownMenu flex items-center flex-col rounded-2xl w-52 bg-skin-bg">
                        <ul className='flex gap-2 flex-col'>
                            <li><i className='bx bx-cog'></i><span>Setting</span></li>
                            <li><i className='bx bx-chart'></i><span>Your Activity</span></li>
                            <li> <ThemeButton/> </li>
                            <li><i className='bx bx-bookmark'></i><span>Save</span></li>
                            <li><i className='bx bx-error-circle'></i><span className='flex items-center justify-center z-20'>Report an issue</span></li>
                            <li onClick={handleLogout}><i className='bx bxs-log-in'></i><span>Logout</span></li>
                        </ul>
                    </div>}
                    </li>
                    <li onClick={()=>setTab("none")}><i className='bx bx-menu-alt-left'></i><span>DevTools</span></li>
                </ul>
            </div>
        </div>
    )
}