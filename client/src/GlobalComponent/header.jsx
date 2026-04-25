import ThemeButton from "../components/toggleButton";
import React, { useEffect, useState } from 'react'
import { UnivuUserInfo } from "../lib/basicUserinfo";
import { useLocation } from "react-router-dom";
import {toggleABMenu} from '../lib/toggleTheme';
import {getColor} from '../utils/getGradnt'
import { GradientSVG } from "../utils/getSVG";
import { FaLaptopCode, FaGithubSquare } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { LiaGhostSolid } from "react-icons/lia";
import { IoMdArrowDropdown, IoMdSettings } from "react-icons/io";
import { MdReportGmailerrorred } from "react-icons/md";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { RiLogoutCircleRLine } from "react-icons/ri";
export default function Header() {
    const [isToggle,setToggle] = useState(false)
    const [userData,setdata] = useState({});
    const [toggleBtn,setBtn] = useState(true)
    let {userInfo} = UnivuUserInfo();
    let gradColor = getColor();
    let crntLocation = useLocation();
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);
    useEffect(()=>{
        setdata(userInfo);
    },[userInfo])

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
        {(Object.keys(userData).length !== 0) && <div className={`headerContainer h-[7dvh] cursor-pointer lg:hidden  w-full  rounded flex items-center justify-between
                bg-blue-800/10 backdrop-blur-lg 
                bg-size-[200%_200%]  hover:text-skin-text transition-all duration-700 ease-in-out text-skin-text border-b border-gray-500 z-20`}>
                <div className="firstHalf lg:hidden w-1/2 flex items-center pl-3 gap-2">
                <div onClick={()=>toggleMenu(!isMenuToggling)} className="h-10 w-10 menuBTN flex items-center justify-center text-3xl border-gray-500 border rounded-lg"><IoMenu/></div>
                        <GradientSVG id={"abMenui"} />
                        <FaLaptopCode style={{fill: "url(#abMenui)"}} className="text-3xl " />
                                       
                        <p className={`text-2xl bg-size-[200%_200%]
                            bg-linear-to-tl ${gradColor}
                            bg-clip-text text-transparent font-bold`}>NullVain
                        </p>
                </div>

                <div className="middleWhr lg:hidden relative flex items-center flex-row">
                    <FaLaptopCode style={{fill: "url(#abMenui"}} className="absolute left-1.5 text-2xl"/>
                    <input type="text" name="searchBox1" placeholder="Type to serch" />
                </div>
                {/* <ThemeButton/> */}
                <div className="scondHalf   w-1/3 flex items-center justify-around text-2xl">
                    <div className=" cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <LiaGhostSolid className="m-1 border-r" />
                        <IoMdArrowDropdown className=' text-[18px]' />
                  </div>
                    <div className=" cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <FaGithubSquare title="Source Code" className="m-1 pr-1 border-r"/>
                        <MdReportGmailerrorred title="Report an issue" className=" m-0.5"/>
                    </div>
                  
                    <div className=" cursor-pointer p-1 miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <TbMessageChatbotFilled/>
                    </div>
                </div>
                <div className="userMenu relative flex items-center lg:hidden text-skin-text!">
                    <div onClick={()=>setToggle(prev=>!prev)} className=" h-10 w-10 bg-black rounded-full flex items-center justify-center border-2 border-amber-200">
                        <img className="h-7.5 w-7.5 rounded-full" src={userData.avatar ? userData.avatar :"https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" />
                    </div>
                    {
                    isToggle && <div className="dropDown absolute px-3 border border-white-20 shadow-lg rounded-2xl
                    z-50 backdrop-blur-md bg-skin-bg/50 
                    ">
                        <ul>
                            <li><ImProfile/> Profile</li>
                            <li><ThemeButton/></li>
                            <li><IoMdSettings/> Setting</li>
                            <li onClick={handleLogout}><RiLogoutCircleRLine/> Logout</li>
                        </ul>
                    </div>
                    }
                </div>
            </div>}
        </>
    )
}