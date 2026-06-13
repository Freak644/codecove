import { useState } from "react";
import { ClickSvg } from "../../../../utils/SVG/menuSVG";
import { HeartOL } from "../../../../utils/SVG/TODOsvg";

export default function FeedController ({feedData}) {

    const [toggle,setToggle] = useState(false);

    const tempArr = [
        {
            imgIcon:"https://res.cloudinary.com/dcve50avm/image/upload/v1780164566/termux-svgrepo-com_tx8vl8.svg",
            iName:"Linux",
            dis:"Operating systems, commands, scripting and more."
        },

        {
            imgIcon:"https://res.cloudinary.com/dcve50avm/image/upload/v1780164565/pencil-edit-create-compose-write-new-svgrepo-com_uvjnzw.svg",
            iName:"UI Designs",
            dis:"User interface, dsign patterns, and visual design."
        },

        {
            imgIcon:"https://res.cloudinary.com/dcve50avm/image/upload/v1780164565/react-svgrepo-com_hg7avr.svg",
            iName:"React JS",
            dis:"React concepts, components, hooks and state management."
        }
    ]

    return(
        <div className="underTaker h-9/10! text-skin-text p-1.5 flex-wrap my-scroll">
            <div className="h-20 w-full border border-cyan-500/25 bg-indigo-950/50
            rounded-lg p-2.5 flex items-center flex-row">
                <div className="h-9 flex items-center justify-center w-9 bg-blue-800 rounded-full">
                    <ClickSvg className="text-2xl text-white" />
                </div>
                
                <div className="p-2.5 flex items-start gap-px flex-col">
                    <p className="text-skin-ptext/70 text-[12px]">Suggestion Source</p>
                    <h3 className="text-md">Click From Explore Section</h3>
                    <p className="text-skin-ptext/70 text-[12px]">This is where your current suggestions came from.</p>
                </div>

            </div>

            <div className="h-70 w-full cstm-Bg p-3 flex gap-2 items-start relative flex-col">
                <div className="firstFace 1/10 flex items-start flex-col">
                    <p className="text-nowrap  flex items-center gap-2 justify-center"><HeartOL className="text-purple-700! text-lg"/> Current Interests </p>
                    <p className="text-[10px] text-skin-ptext/70">Manage your interests to personalize suggestions.</p>
                </div>

                <div className="content w-full bg-blue-950/30 h-8/10 rounded-lg border flex items-center flex-col border-green-700/30 my-scroll">
                    {tempArr.map((obj,index) => (
                        <div key={index} className="itemContainer w-full relative border-b border-b-gray-600/50 p-2.5 gap-2.5 flex items-center justify-start">
                            <div className="imgHolder-i h-7 w-7 flex items-center justify-center border border-gray-500/30
                            rounded-lg bg-gray-600/20">
                                <img src={obj.imgIcon}
                                className="h-6 w-6" alt="" />
                            </div>
                            
                            <div className="textDivm w-40 flex items-start flex-col gap-1">
                                <h4 className="text-[12px]">{obj.iName}</h4>
                                <p className="text-[9px] text-skin-ptext/70">{obj.dis}</p>
                            </div>

                            <div className="toggleBtnart gap-1.5 absolute right-2.5 text-sm flex items-center flex-col">
                                <button onClick={()=> setToggle(prev=>!prev)} className={`h-4.5 cursor-pointer w-8.5 p-0.5 rounded-2xl border transition-all duration-100 ${toggle ? "border-green-500 bg-green-700/30" : "border-gray-600/50"}`}>
                                    <div className={`h-3 w-3 rounded-full ${toggle ? "bg-green-500 translate-x-4!" : "bg-gray-500 translate-0!"} translate-x-2 transition-all duration-300`}/>
                                </button>
                                <span className={`text-[9px] ${toggle ? "text-green-500" : "text-gray-500"}`}>{toggle ? "On" : "Off"}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <div className="h-55 w-full cstm-Bg p-3 flex gap-2 items-start relative flex-col">
                    <img className="" src="https://res.cloudinary.com/dcve50avm/image/upload/v1780331894/Screenshot_2026-06-01_220610_hzog21.png" alt="" />
            </div>
        </div>
    )
}