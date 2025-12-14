import { useEffect, useState } from "react";
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



    useEffect(()=>{
        setPostOBJ({postGroup:""})
    },[])

    const handleTabs = value=>{
        setTab(prev=>({
            ...prev,
            caption: value === "cap",
            image: value === "img",
            uc: value === "uc"
        }))
    }
    return(
        <div className="underTaker ">
            <div className="mainCreate h-full flex items-start justify-start flex-wrap p-4 sm:p-8 text-skin-text gap-5 w-full">
                <div className="headerDiv w-full flex items-start flex-col gap-4">
                    <h2 className={`font-extrabold! text-2xl pl-4 transition-all duration-500 ease-in-out bg-size-[200%_100%]
                    bg-linear-to-tr ${gradColor}
                    bg-clip-text text-transparent`}>New Moment</h2>
                    <div className="postType flex items-center justify-center p-2">
                        
                        <select
                            onChange={(evnt) =>
                                setPostOBJ({ postGroup: evnt.target.value })
                            }
                            className="focus:border-skin-text/30"
                            defaultValue=""
                            >
                            <option value="" disabled>
                                def Moment(?)
                            </option>
                            <option value="Bugs" title="Bug Reports & Errors">
                                👾 Bugs
                            </option>

                            <option value="TIL" title="Today I Learned">
                                🎒 TIL
                            </option>

                            <option value="Snippets" title="Code Snippets & Demos">
                                💻 Snippets
                            </option>

                            <option value="Mini Blog" title="Mini Tech Blogs">
                                ✍️ Mini Blog
                            </option>

                            <option value="Setup Showcase" title="Workstation & Setup Showcase">
                                🖥️ Setup Showcase
                            </option>

                            <option value="QuickTips" title="Tips, Tricks & Micro Skills">
                                ⚡ QuickTips
                            </option>

                            <option value="Meme" title="Meme Zone for Devs">
                                🤖 Dev Memes
                            </option>

                            <option value="WIP" title="Share Your Work-in-Progress">
                                🛠️ WIP
                            </option>
                            </select>

                    </div>
                </div>
                <div className="navBar flex items-center-safe pl-10 w-full">
                    <ul className="flex items-center-safe flex-row gap-10">
                        <li onClick={()=>handleTabs("cap")} className={`${crntTab.caption ? "navSlider":""}`}>Caption</li>
                        <li onClick={()=>handleTabs("img")} className={`${crntTab.image ? "navSlider":""}`}>Image</li>
                        <li onClick={()=>handleTabs("uc")} className={`${crntTab.uc ? "navSlider":""}`}>Upload & Control</li>
                    </ul>
                </div>
                <div className="comSpace  rounded-lg bg-blue-900/10 backdrop-blur-md h-2/3 sm:h-3/6 max-h-4/5 sm:w-3/5 w-full my-scroll">
                        <CompAnim key={
                            crntTab.caption ? "caption" : 
                            crntTab.image ? "image" : 
                            crntTab.uc ? "UC" : "none"
                        }  >
                            {crntTab.caption && <CaptionEl/>}
                            {crntTab.image && <DragDropBox/>}
                            {crntTab.uc && <UploadController/>}
                        </CompAnim>
                </div>
            </div>
        </div>
    )
}