import { useEffect, useRef, useState } from "react";
import ImageSlider from "../Promulgation/sliderCom"
import Caption from "./miniCom/captionCom";
import TODOList from "./miniCom/TODOCompunent";
import MiniDropDown from "./miniCom/threedotDropDown";

export default function PostsCon({posts,fetch}) {
    const [isDropDown,setDropDown] = useState({});
    const Refs = useRef({});
    const setCallback = (id)=> (el) =>{
        Refs.current[id] = el;
    }
       

    useEffect(()=>{
        const handleClick = evnt=>{
            const el = Refs.current[isDropDown.p_id];
            if (el && !el.contains(evnt.target)) {
                setDropDown(false);
            }
        }

        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click",handleClick)
    },[isDropDown])


    return(
        
            <div className="h-9/10 w-auto flex items-center justify-center p-5 flex-wrap my-scroll gap-6">
                {
                    posts.map(({caption,canComment,images_url,canSave, post_id,username,avatar,post_moment,likeCount, isLiked,visibility,totalLike,id})=>{
                        return(
                            <div key={post_id} className="flex items-start flex-col h-full gap-3 w-[450px] singlePost rounded-lg m-3">
                                <div className="ownInfo h-2/12 flex items-start justify-between flex-wrap p-1 gap-1.5 text-skin-text w-full rounded-lg">
                                    <div className="innerINFODiv p-1 flex items-start flex-1 gap-2.5">
                                        <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                                        <p className="text-lg flex items-center gap-2"><span>{username}</span> <span className="font-bold text-sm text-nowrap flex items-center flex-row">/{post_moment}</span></p>
                                    </div>
                                    <div ref={setCallback(post_id)} className="innerINFODiv flex-1 flex items-center justify-end relative!">
                                        <i onClick={()=>setDropDown({...isDropDown,p_id:post_id,isTrue:true})} className='bx bx-dots-vertical-rounded text-2xl cursor-pointer'></i>
                                        {(isDropDown?.p_id===post_id && isDropDown.isTrue) && <MiniDropDown postInfo={{username,images_url,post_id,canComment,likeCount, visibility,}} toggle={setDropDown}/>}
                                    </div>
                                    <Caption text={caption} />
                                </div>
                                <div className="imgContainer w-full h-7/10 flex items-center">
                                     <ImageSlider imgArray={images_url} />
                                </div>
                                <TODOList crntPost={{canComment,canSave, post_id,images_url,username,totalLike, isLiked, id}} />
                            </div>
                        )
                    })
                }
            </div>
        
    )
}