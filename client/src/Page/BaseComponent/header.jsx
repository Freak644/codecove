import ThemeButton from "../../components/toggleButton";
import React, { useEffect, useState } from 'react'
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import { useLocation } from "react-router-dom";
import {toggleABMenu} from '../../lib/toggleTheme';
import {getColor} from '../../utils/getGradnt'
export default function Header() {
    const [isToggle,setToggle] = useState(false)
    const [isHome,setHome] = useState(true)
    const [userData,setdata] = useState({});
    let {userInfo} = UnivuUserInfo();
    let gradColor = getColor();
    let crntLocation = useLocation();
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);
    useEffect(()=>{
        setdata(userInfo);
    },[userInfo])

    useEffect(()=>{
        if (window.innerWidth > 1023 && crntLocation.pathname !== "/") {
            setHome(false)
        }
    },[])
    const handleLogout = async () => {
        let rqst = await fetch("/myServer/Logout",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST"
        })
        let result = await rqst.json();
        console.log(result)
        if (result.pass) {
            location.reload();
        }
    }
    return(
        <>
        {(Object.keys(userData).length !== 0 && isHome) && <div className="headerContainer h-[9vh] cursor-pointer lg:h-10 lg:w-[200px] lg:rounded-4xl lg:absolute lg:top-4/5 lg:right-30! w-full  rounded flex items-center justify-between
                lg:bg-linear-to-tr lg:from-yellow-400 lg:via-purple-600 lg:to-pink-500 bg-blue-800/10 backdrop-blur-lg
                bg-size-[200%_200%] lg:hover:via-blue-500 lg:text-white hover:text-skin-text transition-all duration-500 ease-in-out text-skin-text border-b border-gray-500">
                <div className="firstHalf lg:hidden w-1/2 flex items-center pl-3 gap-2">
                <div onClick={()=>toggleMenu(!isMenuToggling)} className="h-10 w-10 menuBTN flex items-center justify-center text-3xl border-gray-500 border rounded-lg"><i className="bx bx-menu text-skin-ptext"></i></div>
                        <i className={`bx bx-code-block text-3xl bg-size-[200%_200%]
                            bg-linear-to-tr ${gradColor}
                            bg-clip-text text-transparent`}>

                        </i>
                        <p className={`text-2xl bg-size-[200%_200%]
                            bg-linear-to-tr ${gradColor}
                            bg-clip-text text-transparent font-bold`}>CodeCove
                        </p>
                </div>

                <div className="middleWhr lg:hidden relative flex items-center flex-row">
                    <i className={`absolute left-1.5 bx bx-code-block transition-all duration-500
                ease-in-out bg-size-[200%_200%] bg-linear-to-br ${gradColor} 
                bg-clip-text text-transparent text-2xl`}
                ></i>
                    <input type="text" name="searchBox1" />
                </div>
                {/* <ThemeButton/> */}
                <div className="scondHalf  lg:w-full w-1/3 flex items-center justify-around text-2xl">
                    <div className="lg:hidden cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <i className="bx bx-ghost m-1 border-r"></i>
                        <i className='bx bx-chevron-down text-[18px]'></i>
                    </div>
                    <div className="lg:hidden cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <i title="Source Code" className="bx bxl-github m-1 pr-1 border-r"></i>
                        <i title="Report an issue" className="bx bx-info-circle m-0.5"></i>
                    </div>
                    {/* <i className="bx bx-cog lg:hidden!"></i> */}
                    <i className='bx bx-message-rounded-detail lg:border-0 border-2 border-skin-ptext/30 p-1 rounded-lg'><span className="lg:inline hidden">Message</span></i>
                </div>
                <div className="userMenu relative flex items-center lg:hidden text-skin-text!">
                    <div onClick={()=>setToggle(prev=>!prev)} className=" h-10 w-10 bg-black rounded-full flex items-center justify-center border-2 border-amber-200">
                        <img className="h-[30px] w-[30px] rounded-full" src={userData.avatar ? `/myServer/${userData.avatar}` :"https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" />
                    </div>
                    {
                    isToggle && <div className="dropDown absolute px-3 border border-white-20 shadow-lg rounded-2xl
                    z-50 backdrop-blur-md bg-skin-bg/50 
                    ">
                        <ul>
                            <li><i className="bx bx-user-circle text-skin-text!"></i> Profile</li>
                            <li><ThemeButton/></li>
                            <li><i className="bx bx-cog text-skin-text!"></i> Setting</li>
                            <li onClick={handleLogout}><i className="bx bx-log-out text-skin-text!"></i> Logout</li>
                        </ul>
                    </div>
                    }
                </div>
            </div>}
        </>
    )
}