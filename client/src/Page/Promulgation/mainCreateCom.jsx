import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CreateIcon } from "../../utils/SVG/TODOsvg";
import CaptionAttachment from "./captionAttachment";
import ContentAdder from "./contentAdder";

export default function CreatePostContainer () {
    // const [postSechma, setSechma] = useState({
    //     visibiLity:"",
    //     commentFilterLevel:1,
    //     images_url:[],
    //     caption:"",
    //     post_moment:"",
    //     canComment:true,
    //     whoCanSave:"",
    //     showLikeCommentCount:true
    // });

    const containerRef = useRef(null);
    const navi = useNavigate();

    useEffect(()=>{
        const handleClick = (evnt)=> {
            const el = containerRef.current;
            if (el && !el.contains(evnt.target)) {
                console.log("i am Listing");
                navi(-1);
            }
        }

        document.addEventListener("click", handleClick);

        return ()=> document.removeEventListener("click", handleClick);
    },[containerRef])

    return(
        <div ref={containerRef} className="h-9/10 p-2.5 w-9/10 insetShadow rounded-xl bg-gray-950/95 flex items-center flex-col">
            <div className="topHeading w-full h-1/10 p-2 flex items-center text-4xl flex-row gap-2.5">
                <CreateIcon className="text-violet-500"/>
                <div className="flex items-start flex-col text-skin-text">
                    <p className="text-xl">Create Post</p>
                    <span className="text-sm text-skin-ptext">Share your knowledge with community 🚀</span>
                </div>
            </div>

            <div className="triplH h-9/10 w-full flex items-center flex-row gap-2.5 p-2.5">
                <div className="flex-2 border border-gray-800 bg-violet-950/10 rounded-lg h-full">
                    <CaptionAttachment />
                  
                </div>
                <div className="flex-1 bg-violet-950/10 border border-gray-800 rounded-lg h-full">

                </div>
                <div className="flex-1 bg-violet-950/10 border border-gray-800 rounded-lg h-full">

                </div>
            </div>
        </div>
    )
}