import { useEffect, useRef, useState } from "react";
import ImageSlider from "../Promulgation/sliderCom"
import Caption from "./miniCom/captionCom";
import TODOList from "./miniCom/TODOCompunent";
import MiniDropDown from "./miniCom/threedotDropDown";
import { univPostStore } from "../../lib/basicUserinfo";
import { Link } from "react-router-dom";
import FloationStart from "./miniCom/floatingStar";

export default function PostsCon({posts}) {
    let {caption,canComment,images_url,canSave, post_id,username,avatar,post_moment,likeCount, isLiked,visibility,totalLike,id,isFollowing} = posts;
    const [isDropDown,setDropDown] = useState({});
    let {postsById,setUnivPost} = univPostStore();

    const Refs = useRef({});
    const setCallback = (id)=> (el) =>{
        Refs.current[id] = el;
    }
    
    useEffect(()=>{
        if (!post_id || !posts || Object.keys(postsById).includes(post_id)) return;
        setUnivPost({[post_id]:posts});
    },[posts,post_id,postsById])

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
        
            <>

                <div key={post_id} className="flex items-start flex-col h-150 gap-3 w-112.5 rounded-lg m-3 relative">
                    <div className="p-2 z-10 flex items-start flex-1 gap-2 absolute -top-1 text-skin-text floatingPart
                     bg-linear-to-tl from-yellow-500/20 to-purple-500/20 via-pink-500/20 border border-skin-text/20 rounded-lg backdrop-blur-lg hover:scale-97 scale-3d hover:bg-amber-600/20 hover:left-3 transition-all duration-100 ease-in-out" >
                        <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                        <p className="text-lg flex items-center gap-2">
                            <Link to={`/Lab/${username}`}>
                                <span className="hover:underline underline-offset-1">{username}</span>
                            </Link> 
                            <Link to={`/Explore/${post_moment}`}>
                                <span className="hover:underline underline-offset-1 font-bold text-sm text-nowrap flex items-center flex-row">/{post_moment}</span>
                            </Link>
                        </p>   
                    </div>
                    <div className="flex items-start flex-col gap-3 h-full w-full rounded-lg singlePost z-1">
                        <div className="ownInfo h-2/12 flex items-start justify-between flex-wrap p-1 gap-1.5 text-skin-text w-full rounded-lg relative">
                            <div className="innerINFODiv p-1 flex items-start flex-1 gap-2 " >
                                <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                                <p className="text-lg flex items-center gap-2">
                                    <Link to={`/Lab/${username}`}>
                                        <span className="hover:underline underline-offset-1">{username}</span>
                                    </Link> 
                                    <Link to={`/Explore/${post_moment}`}>
                                        <span className="hover:underline underline-offset-1 font-bold text-sm text-nowrap flex items-center flex-row"></span>
                                    </Link>
                                </p>   
                            </div>
                            <div ref={setCallback(post_id)} className="innerINFODiv flex-1 flex items-center justify-end relative! top-2.5!">
                                <i onClick={()=>setDropDown({...isDropDown,p_id:post_id,isTrue:true})} className='bx bx-dots-vertical-rounded text-2xl cursor-pointer'></i>
                                {(isDropDown?.p_id===post_id && isDropDown.isTrue) && <MiniDropDown postInfo={{username,isFollowing,images_url,post_id,canComment,likeCount, visibility}} toggle={setDropDown}/>}
                            </div>
                            <Caption text={caption} />
                        </div>
                        <div className="imgContainer w-full h-7/10 flex items-center relative">
                            <FloationStart post_id={post_id} like={isLiked} totalLike={totalLike}/>
                            <ImageSlider imgArray={images_url} />
                        </div>
                        <TODOList crntPost_id={post_id} />
                    </div>
                </div>
            </>
        
    )
}