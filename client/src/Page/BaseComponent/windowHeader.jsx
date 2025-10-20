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
        <div className="mainheaderCom relative w-[100vw] h-[50px] flex items-center justify-between p-1 
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
            <div className="rightHeader flex-1 text-white">
                
            </div>
            
        </div>
    )
}