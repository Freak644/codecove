import { useState } from "react";
import { getColor } from "../../utils/getGradnt"
import CaptionEl from "./miniComp/Caption";
import { usePostStore } from "../../lib/basicUserinfo";
import CompAnim from "../../assets/animations/compAnimation";
import DragDropBox from "./dropBox";
import UploadController from "./miniComp/controller";

export default function BaseCreate() {
    let gradColor = getColor();
    let {setPostOBJ} = usePostStore();
    const [crntTab,setTab] = useState({
        caption:true,
        image:false,
        uc:false
    });

    const handleTabs = value=>{
        setTab(prev=>({
            ...prev,
            caption: value === "cap",
            image: value === "img",
            uc: value === "uc"
        }))
    }
    return(
        <div className="h-full w-full flex items-center sm:pl-[5%] border">
            <div className="mainCreate h-full flex items-start flex-col p-4 sm:p-8 text-skin-text gap-10 w-full">
                <div className="headerDiv flex items-center flex-col gap-4">
                    <h2 className={`font-extrabold! text-2xl transition-all duration-500 ease-in-out bg-size-[200%_100%]
                    bg-linear-to-tr ${gradColor}
                    bg-clip-text text-transparent`}>New Moment</h2>
                    <div className="postType flex items-center justify-center p-2">
                        
                        <select onChange={(evnt)=>setPostOBJ({postGroup:evnt.target.value})} className=" focus:border-skin-text/30" name="" id="" defaultValue="">
                            <option value="" disabled>def Moment(?)</option>
                            <option value="Meme" title="Meme Zone for Devs">🤖 Dev Memes</option>
                            <option value="Bugs" title="Bug Reports & Errors">👾 Bugs</option>
                        </select>
                    </div>
                </div>
                <div className="navBar flex items-center-safe pl-10">
                    <ul className="flex items-center-safe flex-row gap-10">
                        <li onClick={()=>handleTabs("cap")} className={`${crntTab.caption ? "navSlider":""}`}>Caption</li>
                        <li onClick={()=>handleTabs("img")} className={`${crntTab.image ? "navSlider":""}`}>Image</li>
                        <li onClick={()=>handleTabs("uc")} className={`${crntTab.uc ? "navSlider":""}`}>Upload & Control</li>
                    </ul>
                </div>
                <div className="comSpace  rounded-lg my-scroll h-auto sm:w-3/5 w-full ">
                        <CompAnim key={
                            crntTab.caption ? "caption" : 
                            crntTab.image ? "image" : 
                            crntTab.uc ? "UC" : "none"
                        } >
                            {crntTab.caption && <CaptionEl/>}
                            {crntTab.image && <DragDropBox/>}
                            {crntTab.uc && <UploadController/>}
                        </CompAnim>
                </div>
            </div>
        </div>
    )
}