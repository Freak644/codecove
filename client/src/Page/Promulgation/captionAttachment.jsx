import { useEffect } from "react";
import { UnivuUserInfo } from "../../lib/basicUserinfo"
import { useNavigate } from "react-router-dom";
import { TringleIcon } from "../../utils/SVG/SVG";
import { PublicGlob } from "../../utils/SVG/TODOsvg";
import CaptionComponent from "./Caption";

export default function CaptionAttachment ({postData, setPostData}) {
    const userInfo = UnivuUserInfo(stat => stat.userInfo);
    const navi = useNavigate();

    const handleNameClick = (username) => {
        navi(`/Lab/${username}`)
    }
    useEffect(()=>{
        console.log(userInfo);
    },[userInfo])
    return(
        <div className="underTaker p-2.5! flex-col!">
            <div className="postUserInfo p-2.5 h-4/10  w-full flex items-center flex-col gap-2.5">
                <div className="h-2/10 w-full flex items-center flex-row p-2.5 gap-2.5 relative">
                    <img onClick={()=>handleNameClick(userInfo.username)} className="h-10 rounded-full" src={userInfo.avatar+"?size=40"} alt="" />
                    <div onClick={()=>handleNameClick(userInfo.username)} className="userName cursor-pointer hover:opacity-80 text-skin-text flex items-start flex-col">
                        <p>{userInfo.name}</p>
                        <span className="text-[12px] text-skin-ptext flex items-center">{"@"+userInfo.username} <TringleIcon/></span>
                    </div>

                    <div className="p-1.5 rounded-md flex items-center justify-center text-purple-600 font-bold absolute right-2.5 bg-violet-900/30">
                    <PublicGlob className='mr-0.5 text-[14px]' /> <p>Public</p> <TringleIcon className="-translate-y-0.5 ml-px" />
                    </div>

                </div>

                <div className="captionDiv border border-gray-800 w-full rounded-lg h-8/10">
                    <CaptionComponent UName={userInfo.name} />
                </div>
            </div>

            <div className="h-6/10 w-full flex items-center flex-col">
                
            </div>
        </div>
    )
}