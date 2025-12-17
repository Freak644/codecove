import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../Promulgation/sliderCom";
import { useEffect, useRef, useState } from "react";
import { univPostStore } from "../../../lib/basicUserinfo";
import CommentEl from "./commentContainer";

export default function MaximizeContainer() {
    let {pID} = useParams();
    let navi = useNavigate();
    let containerRef = useRef(null);
    const postData = univPostStore(stat=>stat.postsById[pID]);
    const [crntPost,setCrntPost] = useState({});
    const [isFull,setFull] = useState(false);

    const getCrntPost = async (postID) => {
        try {
            let rqst = await fetch('/mySever/')
        } catch (error) {
            
        }
    }

    useEffect(()=>{
       // getCrntPost(pID);
        setCrntPost(postData)
    },[pID,postData]);


    useEffect(()=>{
        const handleClick = evnt=>{
            const el = containerRef.current;
            if (el && !el.contains(evnt.target)) {
                navi(-1);
            }
        }

        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click",handleClick);
    },[])

    return(
            <div className="underTaker">
                <div className="closeBtn flex items-center justify-center p-3 rounded-full text-2xl font-bold text-skin-ptext absolute top-5 right-2">
                    <button className="cursor-pointer"
                        onClick={()=>navi(-1)}
                    >
                        X
                    </button>
                </div>
                <div ref={containerRef} className="h-4/5 w-4/6 rounded-lg p-2 flex items-center justify-center flex-wrap border border-white bg-black/50 backdrop-blur-lg">
                    <div className="flex-1 flex items-center justify-center border border-green-500 h-full relative transition-all duration-200">
                    <i className={`bx bx${isFull ? "-exit-" : "-"}fullscreen absolute bottom-4 right-5 z-20 text-skin-ptext text-2xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>setFull(prev=>!prev)}></i>
                    <ImageSlider imgArray={crntPost.images_url || []} />
                    </div>
                  {!isFull && 
                   <div className="flex-1 flex items-center justify-center border border-purple-500 h-full">
                    <CommentEl commentData={postData.post_id} />
                    </div>}
                </div>
            </div>
    )
}