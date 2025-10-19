import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ThemeButton from '../../components/toggleButton'
export default function MenuEL(params) {
    const [currentTab,setTab] = useState('Home');
    const [logoimg,setlogo] = useState("")
    const [isDD,setDD] = useState(false)
    useEffect(()=>{
        getUserInfo();
    },[])
    const getUserInfo = async () => {
        try {
            let rkv = await fetch("/myServer/isUser")
            let result = await rkv.json();
            if (result.err) {
                throw new Error(result.err);
                } else if (result.login) {
                    sessionStorage.clear();
                    location.reload()
                }
                setlogo(result.userinfo[0].avatar)
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
        }
    }
    return(
        <div className="menuDiv border-r-1  h-[91vh] border-gray-400 lg:h-[100vh] lg:w-[200px]
        flex items-center flex-col gap-5
        ">
            <div className="Logotxt flex items-center flex-col w-[120px]">
                <i className='bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-[length:200%_200%]
                bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent
                '></i>
                <h2 className=' font-bold text-2xl transition-all duration-500 ease-in-out bg-[length:200%_200%]
                bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent'>CodeCove</h2>
            </div>
            <div className='menuContainer flex items-center flex-col gap-10 lg:text-[20px] sm:text-3xl text-skin-text'>
                <ul className='flex items-start flex-col gap-5  border-b-2 border-gray-400'>
                <li onClick={()=>setTab('Home')}><i className={`bx ${currentTab==='Home'?"bxs":"bx"}-home text-skin-text`}></i><span>Home</span></li>
                <li onClick={()=>setTab('Search')}><i className={`bx ${currentTab==='Search'?"bxs":"bx"}-search text-skin-text`}></i><span>Search</span></li>
                <li onClick={()=>setTab('Chat')}><i className={`bx ${currentTab==='Chat'?"bxs":"bx"}-chat text-skin-text`}></i><span>Messages</span></li>
                <li onClick={()=>setTab('Explore')}><i className={`bx ${currentTab==='Explore'?"bxs":"bx"}-compass text-skin-text`}></i><span>Explore</span></li>
                <li onClick={()=>setTab('Noti')}><i className={`bx ${currentTab==='Noti'?"bxs":"bx"}-bell text-skin-text`}></i><span>Notifications</span></li>
                <li onClick={()=>setTab('Profile')}> <div className='imgDiv h-[20px] w-[20px] md:h-[30px] md:w-[30px] border rounded-full flex items-center justify-center'><img className='h-[100%] w-[100%]' src={logoimg ? `/myServer/${logoimg}` :"https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" /></div> <span>Profile</span></li>
                </ul>
                <ul className='secul flex items-start flex-col gap-5'>
                    <li onClick={()=>{setTab("none");setDD(prev=>!prev)}} className='relative'><i className='bx bx-menu'></i><span>Menu</span>
                    {isDD && <div className="dropdownMenu flex items-center flex-col rounded-2xl w-52 bg-gray-600">
                        <ul >
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