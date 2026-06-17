import { useEffect, useState } from "react";
import { toggleSlider } from "../../../lib/tabToggle"
import { notification } from "../../../utils/notificationSender";
import NotificationMgmt from "./notificaiton";
import { AltMail, CogIcon, CommentSvg, FileSvg, FollowSvgL, FsquareSvg } from "../../../utils/SVG/menuSVG";

export default function NotificaitonMini() {
    const {toggleMiniTab} = toggleSlider();
    const [notiTab,setTab] = useState("All");

    useEffect(()=>{
        
    },[])

    const showTestNotification = ()=>{
        notification("Test 2/.3","Testing",true,"http://localhost:3221/post/kBO61tMtRgdpofmEHqmd4")
    }
    return(
        <div className="underTaker no-copy flex-wrap bg-blue-950/30 rounded-lg backdrop-blur-lg shadow-lg overflow-hidden">
    
                {/* Header */}
                <div className="NotificationHeader h-3/17 w-full flex items-start flex-wrap gap-2.5 text-skin-text justify-center px-4 py-3 border-b border-gray-400/20">
                    
                    {/* Top Row */}
                    <div className="flex justify-end items-center gap-3 w-full">
                        
                        {/* Notification Icon */}
                        <p 
                            onClick={showTestNotification} 
                            className="text-lg flex gap-2 text-skin-text/90 items-center cursor-pointer hover:text-skin-ptext transition"
                        > 
                            Notification
                        </p>

                        {/* Mark as Read */}
                        <p className="text-sm text-purple-600 font-bold cursor-pointer hover:text-blue-500 ml-auto transition">
                            Mark all as read 
                        </p>

                        {/* Exit Button */}
                        <CogIcon className="cursor-pointer hover:rotate-90 transition-all duration-300" />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-5 notificaitonHeaderTab bg-blue-950/40 border-gray-500/40 w-full justify-start mt-2 text-sm font-medium border rounded-lg p-2">
                        <p 
                            onClick={()=>setTab("All")} 
                            className={`${notiTab === "All" && "activeNoti"}`}
                        >
                            <FsquareSvg className="text-lg"/> All
                        </p>

                        <p 
                            onClick={()=>setTab("Update")} 
                            className={`${notiTab === "Update" && "activeNoti"}`}
                        >
                            <FileSvg className="text-md"/> Post
                        </p>

                        <p 
                            onClick={()=>setTab("Sys")} 
                            className={`${notiTab === "Sys" && "activeNoti"}`}
                        >
                            <AltMail className="text-md absolute left-0" /> <span className="">Mentions</span>
                        </p>

                        <p 
                            onClick={()=>setTab("Read")} 
                            className={`${notiTab === "Read" && "activeNoti"}`}
                        >
                           <FollowSvgL className="text-lg"/> Follow
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="h-12/14 w-full">
                    <NotificationMgmt/>
                </div>

            </div>
    )
}