import { toggleSlider } from "../../../lib/tabToggle"

export default function NotificaitonMini() {
    const {toggleMiniTab} = toggleSlider();
    return(
        <div className="underTaker flex-wrap bg-skin-text/5 rounded-lg backdrop-blur-lg">
            <div className="NotificationHeader h-2/10 w-full flex
            items-start flex-wrap gap-3 text-skin-text">
                <div className="flex justify-end items-center gap-2.5 w-full">
                    <p className="text-md text-skin-text/80 self-start">Notification</p>
                    <p className="text-sm text-blue-400 cursor-pointer hover:text-blue-500">Mark as read</p>
                    <i onClick={()=>toggleMiniTab("charts")} className="bx bx-exit p-1 rounded-lg text-lg border-2 border-gray-400/30 cursor-pointer"></i>
                </div>
                <p>All</p>
                <p>Update</p>
                <p>System</p>
                <p>Read</p>
            </div>
            <div className="notiContainer h-8/10 w-full">

            </div>
        </div>
    )
}