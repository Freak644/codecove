import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"

export default function WindowHerder(params) {
    let location = useLocation();
    let [pathName,setPath] = useState("");
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
        <div className="mainheaderCom overflow-hidden relative w-[100vw] h-[50px] flex items-center justify-between p-1 
            border-amber-200 border-b border-b-gray-500
        ">
            <div className="leftHeader text-4xl flex flex-1 gap-4 !pl-5">
                <i className="bx bx-menu border-gray-500 border rounded-sm text-skin-ptext"></i>
                <i className="bx bx-code-block transition-all duration-500
                ease-in-out bg[length:200%_200%] bg-gradient-to-br from-purple-500 via-pink-400 to-blue-600 
                bg-clip-text text-transparent
                "></i>
                <span className="text-skin-ptext text-[15px] font-light flex items-center">{pathName}</span>
            </div>
            <div className="rightHeader flex justify-end flex-1 text-skin-login ">
                <form action="" className="flex relative items-center justify-start gap-1 p-2 border-r border-gray-600">
                    <input type="text" placeholder="Type to search" className="!p-1 !pl-8 border-2 placeholder:text-gray-500 transition-all duration-1000 rounded-sm border-gray-500
                    w-64
                    " />
                    <i className="text-2xl bx bx-search-alt text-gray-400 border-r absolute left-3"></i>
                    <div className="miniMenuDiv !m-2 text-2xl border-2 border-gray-600 rounded-lg">
                        <i className="bx bx-ghost m-1 border-r text-gray-300"></i>
                        <i className='bx bx-chevron-down text-[18px]'></i>
                    </div>
                </form>

                <div className="secminiMenuDiv text-2xl flex items-center flex-row gap-6">
                    <div className="createPost ml-2.5">
                        <i className="bx bx-plus"></i>
                        <i className="bx bx-chevron-down"></i>
                    </div>

                    <div className="userThings flex gap-[1vw]">
                        <i title="Report an issue" className="bx bx-info-circle border border-gray-500 p-1 rounded-lg cursor-pointer"></i>
                        <i title="Source Code"  onClick={()=>window.open("https://github.com/Freak644","_blank")} className="bx bxl-github border border-gray-500 p-1 rounded-lg cursor-pointer"></i>
                        <i title="Notification" className="bx bx-bell border border-gray-500 p-1 rounded-lg cursor-pointer"></i>
                        
                    </div>
                </div>
            </div>
            
        </div>
    )
}