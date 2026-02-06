import { useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

export default function PostANDComment() {
    let {pID} = useParams();
    let navi = useNavigate();
    const [crntPost,setCrntPost] = useState({});
    const [isFull,setFull] = useState(false);
    
    return(
        <div className="underTaker p-10!">
            <div className="ImageCon flex-1  flex items-center justify-center h-full relative transition-all duration-200">
                    <i className={`bx bx${isFull ? "-exit-" : "-"}fullscreen absolute bottom-4 right-5 z-20 text-skin-ptext text-2xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>setFull(prev=>!prev)}></i>
                   
                </div>
                <div className={`${isFull ? "w-0!" : "flex-1"} transition-all duration-200 flex items-center justify-center h-full`}>
                 
                </div>
        </div>
    )
}