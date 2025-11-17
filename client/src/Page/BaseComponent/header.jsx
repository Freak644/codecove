import ThemeButton from "../../components/toggleButton";
import React, { useEffect, useState } from 'react'
import { UnivuUserInfo } from "../../lib/basicUserinfo";
export default function Header() {
    const [isToggle,setToggle] = useState(false)
    const [userData,setdata] = useState({});
    let {userInfo} = UnivuUserInfo();
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
        <div className="headerContainer h-[9vh] cursor-pointer lg:bg-gray-500! lg:h-10 lg:w-[200px] lg:rounded-4xl lg:absolute lg:top-4/5 lg:right-30! w-full  rounded flex items-center justify-between
        lg:bg-linear-to-tr lg:from-yellow-400 lg:via-purple-600 lg:to-pink-500 
        bg-size-[200%_200%] hover:bg-position[200%_0%] lg:text-white! lg:hover:text-skin-text! transition-all duration-500 ease-in-out text-skin-text! border-b border-gray-500">
            <div className="firstHalf lg:hidden w-1/2 flex items-center ">
                    <i className="bx bx-code-block text-3xl bg-size-[200%_200%]
                bg-linear-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent"></i><p className="text-2xl bg-size-[200%_200%]
                bg-linear-to-tr from-purple-500 via-pink-500 to-blue-600
                bg-clip-text text-transparent font-bold">CodeCove</p>
            </div>
            {/* <ThemeButton/> */}
            <div className="scondHalf  lg:w-full w-1/3 flex items-center justify-around text-2xl">
                <i className="bx bxl-github lg:hidden!" ></i>
                <i className="bx bx-cog lg:hidden!"></i>
                <i className='bx bx-message-rounded-detail'><span className="lg:inline hidden">Message</span></i>
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
        </div>
    )
}