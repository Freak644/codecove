import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { UnivuUserInfo } from "../lib/basicUserinfo";
import { toggleABMenu } from "../lib/toggleTheme";
import {getColor} from '../utils/getGradnt';
import { toggleSlider } from "../lib/tabToggle";
import SearchEl from "../Page/SearchELs/searchEl";
import {MdMenu, MdReport} from 'react-icons/md'
import { GradientSVG } from "../utils/getSVG";
import {FaLaptopCode, FaSortDown} from 'react-icons/fa'
import { BiGhost } from "react-icons/bi";
import { HiOutlineDocumentAdd } from "react-icons/hi";

export default function WindowHerder() {
    let location = useLocation();
    let [pathName,setPath] = useState("");
    let [userData,setData] = useState({});
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);
    let {userInfo} = UnivuUserInfo();
    let gradColor = getColor();
    const {toggleMiniTab} = toggleSlider();
    useEffect(()=>{
        setData(userInfo)
    },[userInfo])
    useEffect(()=>{
        switch (location.pathname) {
            case "/":
                setPath("Dashbord")
                break;
            default:
                let path = location.pathname.split("/")
                setPath(path[1])
                break;
        }
    },[location.pathname])


    return(
        <>
        <div className="spaceLoaderDiv w-screen absolute top-0 -z-1">
        <div className=" h-1 absolute w-full bg-linear-to-l from-purple-600 via-pink-600 to-yellow-500 ]"></div>
        </div>
        <div className="mainheaderCom relative w-screen h-12.5 flex items-center justify-between p-1 
            border-amber-200 border-b border-b-gray-500 bg-blue-800/10 backdrop-blur-md z-40
        "> 
            <div className="leftHeader text-4xl flex flex-1 gap-4 pl-5">
                <div onClick={()=>toggleMenu(!isMenuToggling)} className="h-10 menuBTN cursor-pointer w-10 flex logotxt items-center justify-center text-3xl border-skin-ptext/30 border rounded-full"><MdMenu className="text-skin-ptext"/></div>
                <GradientSVG id={"winHeader"} />
                <FaLaptopCode style={{fill: "url(#winHeader)"}}/>
                <span className="text-skin-ptext text-[15px]  flex items-center">{pathName}</span>
            </div>
            
            <div className="rightHeader flex justify-end flex-1 text-skin-text ">
                <form action="" className="flex relative items-center justify-start gap-1 p-2  border-skin-ptext/30">
                    <SearchEl inputClass="p-1 pl-8 border-2 placeholder:text-skin-ptext/50 transition-all duration-1000 rounded-sm border-skin-ptext/30
                    w-64" iconClass={`absolute left-2.5 top-2 text-2xl
                `}/>
                   
                    <div className=" cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <BiGhost className="m-1 border-r"/>
                        <FaSortDown className='text-[18px] mb-1'/>
                    </div>
                </form>

                <div className="secminiMenuDiv text-2xl flex items-center flex-row gap-[1vw] ">
                    <div className="createPost flex items-center justify-center ml-2.5 border-2 border-skin-ptext/40 rounded-lg
                    cursor-pointer ">
                        <HiOutlineDocumentAdd className="border-r m-1" />
                        <FaSortDown className='text-[18px] mb-1'/>
                    </div>

                    <div className="userThings flex gap-[1vw]">
                        <MdReport title="Report an issue" className="border text-[35px] border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></MdReport>
                        <i title="Source Code"  onClick={()=>window.open("https://github.com/Freak644","_blank")} className="bx bxl-github border border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></i>
                        <i onClick={()=>toggleMiniTab("noti")} title="Notification" className="bx bx-bell border border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></i>
                        <div title={userData.username || "Loading"} className="h-9 w-9 overflow-hidden cursor-pointer border rounded-full flex items-center justify-center relative">
                            <img className="h-full" src={userData.avatar ? userData.avatar : "https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        </>
    )
}