import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ImageSlider from "../Promulgation/sliderCom"
import TODOList from "./miniCom/TODOCompunent";
const MiniDropDown = lazy(()=> import("./miniCom/threedotDropDown"));
import { univPostStore } from "../../lib/basicUserinfo";
import { Link } from "react-router-dom";
import { ThreeDot } from "../../utils/SVG/menuSVG";


export default function PostsCon({posts}) {
    let {caption,canComment,images_url,canSave, ownerName, post_id,username,avatar,post_moment,likeCount, isLiked,visibility,totalLike,id,isFollowing} = posts;
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

                <div key={post_id} className="flex items-start flex-col h-auto gap-3 w-112.5 rounded-lg m-3 relative">
                    {/* <div className="p-2 z-10 flex items-start flex-1 gap-2 absolute -top-1 text-skin-text floatingPart
                     bg-linear-to-tl from-yellow-500/20 to-purple-500/20 via-pink-500/20 border border-skin-text/20 rounded-lg backdrop-blur-lg hover:scale-97 scale-3d hover:bg-amber-600/20 hover:left-3 transition-all duration-100 ease-in-out" >
                        <img loading="lazy" src={avatar} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                        <p className="text-lg flex items-center gap-2">
                            <Link to={`/Lab/${username}`}>
                                <span className="hover:underline underline-offset-1">{username}</span>
                            </Link> 
                            <Link to={`/Explore/${post_moment}`}>
                                <span className="hover:underline underline-offset-1 font-bold text-sm text-nowrap flex items-center flex-row">/{post_moment}</span>
                            </Link>
                        </p>   
                    </div> */}
                    
                    <div className="singlePost text-skin-text rounded-xl w-full flex items-center flex-col gap-2 p-4">
                        <div className="ownerInfo h-12 flex items-center justify-center gap-2.5 w-full">
                            <div className="imgDiv rounded-full h-10 w-10 ">
                                <img src={avatar} className="rounded-full" alt="DP" />
                            </div>
                            <Link to={"/Lab/"+username} className="nameCat w-4/6 text-sm font-medium gap-1 flex items-start flex-col">
                                <p className="tracking-wide hover:underline underline-offset-1">{ownerName}</p>
                                <div className="flex items-center hover:underline underline-offset-1 flex-row gap-1.5 text-[10px] tracking-wider">{"@"+username} <span className="h-1 bg-skin-text w-1 rounded-full "></span> 
                                    <div className="text-white rounded-md tracking-wider p-1 bg-[rgb(57,0,156)]/70">{post_moment}</div>
                                </div>
                            </Link>

                            <div className="fDot text-sm w-3/13 flex items-center flex-row">
                                <div className="btnDiv h-8 w-16">
                                    {!isFollowing && <button className="bg-indigo-900/50 h-full w-full  rounded-md border border-blue-800/50
                                    cursor-pointer hover:text-white hover:scale-95 duration-300">Follow</button>}
                                </div>
                                <div ref={setCallback(post_id)} className="w-2 flex-1 flex items-center justify-end">
                                    <ThreeDot onClick={()=>setDropDown({...isDropDown,p_id:post_id,isTrue:true})} className='text-lg cursor-pointer' />
                                    {(isDropDown?.p_id===post_id && isDropDown.isTrue) && <Suspense fallback={null}><MiniDropDown postInfo={{username,isFollowing,images_url,post_id,canComment,likeCount, visibility}} toggle={setDropDown}/></Suspense>}
                                </div>
                            </div>
                        </div>

                        <div className="captionDiv w-full h-auto">
                                <div className="whitespace-per-wrap cursor-text text-sm! tracking-wider"
                                dangerouslySetInnerHTML={{__html:caption}}
                                />
                        </div>
                        
                        <p className="w-full  text-indigo-600 hover:underline underline-offset-1">#Code #React #AI</p>

                        <div className="imgContainer w-full flex items-center h-100 relative">
                                        <ImageSlider imgArray={images_url} postInfo={{post_id,isLiked, totalLike}} />
                        </div>

                        <div className="flex items-center flex-row w-full p-0.5 bg-skin-bg/10 backdrop-blur-lg rounded-lg border border-gray-500/10" >
                            <TODOList crntPost_id={post_id} />
                        </div>
                    </div>
                </div>
            </>
        
    )
}