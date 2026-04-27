import { useEffect, useState } from "react";
import { toggleSlider } from "../../../lib/tabToggle"
import { notification } from "../../../utils/notificationSender";
import NotificationMgmt from "./notificaiton";
import { RiNotification2Fill, RiPictureInPictureExitFill } from "react-icons/ri";

export default function NotificaitonMini() {
    const {toggleMiniTab} = toggleSlider();
    const [notiTab,setTab] = useState("All");

    useEffect(()=>{
        
    },[])

    const showTestNotification = ()=>{
        notification("Test 2/.3","Testing",true,"http://localhost:3221/post/kBO61tMtRgdpofmEHqmd4")
    }
    return(
        <div className="underTaker no-copy flex-wrap bg-skin-text/1 rounded-lg backdrop-blur-lg shadow-lg overflow-hidden">
    
                {/* Header */}
                <div className="NotificationHeader h-2/14 w-full flex items-start flex-wrap gap-3 text-skin-text justify-center px-4 py-3 border-b border-gray-400/20">
                    
                    {/* Top Row */}
                    <div className="flex justify-end items-center gap-3 w-full">
                        
                        {/* Notification Icon */}
                        <p 
                            onClick={showTestNotification} 
                            className="text-lg flex gap-2 text-skin-text/80 items-center cursor-pointer hover:text-skin-text transition"
                        > 
                            <RiNotification2Fill/> 
                        </p>

                        {/* Mark as Read */}
                        <p className="text-sm text-blue-400 cursor-pointer hover:text-blue-500 ml-auto transition">
                            Mark as read
                        </p>

                        {/* Exit Button */}
                        <RiPictureInPictureExitFill 
                            onClick={()=>toggleMiniTab("charts")} 
                            className="p-1.5 rounded-lg text-2xl border border-gray-400/30 cursor-pointer hover:bg-gray-400/10 transition"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 w-full justify-start mt-2 text-sm font-medium">
                        <p 
                            onClick={()=>setTab("All")} 
                            className={`cursor-pointer hover:text-skin-text transition ${notiTab === "All" ? "activeNoti" : "text-skin-text/60"}`}
                        >
                            All
                        </p>

                        <p 
                            onClick={()=>setTab("Update")} 
                            className={`cursor-pointer hover:text-skin-text transition ${notiTab === "Update" ? "activeNoti" : "text-skin-text/60"}`}
                        >
                            Update
                        </p>

                        <p 
                            onClick={()=>setTab("Sys")} 
                            className={`cursor-pointer hover:text-skin-text transition ${notiTab === "Sys" ? "activeNoti" : "text-skin-text/60"}`}
                        >
                            System
                        </p>

                        <p 
                            onClick={()=>setTab("Read")} 
                            className={`cursor-pointer hover:text-skin-text transition ${notiTab === "Read" ? "activeNoti" : "text-skin-text/60"}`}
                        >
                            Read
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="h-12/14 w-full my-scroll pt-4 px-2">
                    <NotificationMgmt/>
                </div>

            </div>
    )
}