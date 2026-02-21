import { useEffect, useState } from "react";
import { toggleSlider } from "../../../lib/tabToggle"
import { notification } from "../../../utils/notificationSender";
import NotificationMgmt from "./notificaiton";

export default function NotificaitonMini() {
    const {toggleMiniTab} = toggleSlider();
    const [notiTab,setTab] = useState("All");

    useEffect(()=>{
        
    },[])

    const showTestNotification = ()=>{
        notification("Test 2/.3","Testing",true,"http://localhost:3221/post/kBO61tMtRgdpofmEHqmd4")
    }
    return(
        <div className="underTaker flex-wrap bg-skin-text/1 rounded-lg backdrop-blur-lg">
            <div className="NotificationHeader h-2/14 w-full flex 
            items-start flex-wrap gap-3 text-skin-text justify-center">
                <div className="flex justify-end items-center gap-2.5 w-full">
                    <p onClick={showTestNotification} className="text-lg flex gap-2 text-skin-text/80 items-center"><i className="bx bxs-bell-ring"></i></p>
                    <p className="text-sm text-blue-400 cursor-pointer hover:text-blue-500 ml-auto">Mark as read</p>
                    <i onClick={()=>toggleMiniTab("charts")} className="bx bx-exit p-1 rounded-lg text-lg border-2 border-gray-400/30 cursor-pointer"></i>
                </div>
                <p onClick={()=>setTab("All")} className={notiTab === "All" && "activeNoti"}>All</p>
                <p onClick={()=>setTab("Update")} className={notiTab === "Update" && "activeNoti"}>Update</p>
                <p onClick={()=>setTab("Sys")} className={notiTab === "Sys" && "activeNoti"}>System</p>
                <p onClick={()=>setTab("Read")} className={notiTab === "Read" && "activeNoti"}>Read</p>
            </div>
            <div className="h-12/14 w-full my-scroll pt-50">
                <NotificationMgmt/>
            </div>
        </div>
    )
}