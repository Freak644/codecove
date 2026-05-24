import {lazy, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo";
import {Link, useLocation} from 'react-router-dom';
import socket from "../../../utils/socket";
import {starAudio} from '../../../utils/sound';
import { toast} from 'react-toastify';
import axios from 'axios';

import { BookmarkHeartIcon, BookmarkIcon, CommentIcon, DownloadIcon, ShareIcon, StarFilledIcon, StarIcon } from "../../../utils/SVG/SVG";
import { debouncerGlob } from "../../../utils/debounceFun";

const LikeCom = lazy(()=> import('./TODOComs/likeCom'));
const DisLikeCom = lazy(()=> import('./TODOComs/disLike'));
const SvCom = lazy(()=> import('./TODOComs/saveCom'));


export default function TODOList({crntPost_id}) {
    const toggleRef = useRef(null);
    // const [crntPost,setCrntPost] = useState({})
    const postData = univPostStore(stat=>stat.postsById[crntPost_id]);
    const crntLocation = useLocation();
    let {post_id,images_url, username,canComment, canSave, likeCount, totalComment} = postData || {};
    const index = UnivuUserInfo(stat=>stat.index);
    const [isToggle,setToggle] = useState(false);



    // useEffect(()=>{
    //     console.log(postData)
    // },[postData])


    // useEffect(()=>{
    //     let {post_id} = crntPost;

    //     socket.emit("joinPost",post_id);
        
    //     return () => socket.emit("leavePost",post_id);
    // },[crntPost]);

        function formatCount(value) {
            if (value == null || isNaN(value)) return "0";

            const abs = Math.abs(value);
            const units = [
                { limit: 1e9, suffix: "B" },
                { limit: 1e6, suffix: "M" },
                { limit: 1e3, suffix: "K" }
            ];

            for (const { limit, suffix } of units) {
                if (abs >= limit) {
                    // 👇 truncate instead of round
                    const truncated = Math.floor((abs / limit) * 10) / 10;

                    return (value < 0 ? "-" : "") +
                        truncated.toString().replace(/\.0$/, "") +
                        suffix;
                }
            }

            return value.toString();
        }



    const downloadAll = async (choice) => {
        setToggle(false)
        if (choice) {
            try {
                let rkv = await fetch(images_url[index]);
                let blog = await rkv.blob();

                let link = document.createElement("a");
                link.href = URL.createObjectURL(blog);
                link.download = `ImageFrom-${username}_${Date.now()}.jpg`;
                link.click();

                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.log("Download Failed",error);
            } 
        } else {
            for (let i = 0; i < images_url.length; i++) {
                let url = images_url[i];
    
                try{
                    let rkv = await fetch(url);
                    let blog = await rkv.blob();
                    
                    let link = document.createElement("a");
                    link.href = URL.createObjectURL(blog);
                    link.download = `ImageFrom-${username}.${i}_${Date.now()}.jpg`;
                    link.click();
    
                    URL.revokeObjectURL(link.href);
                } catch (error) {
                    console.log("Download Failed", error);
                }
            }
        }
    }

    useEffect(()=>{
        const handleClick = evnt=>{
            const el = toggleRef.current;
            if (el && !el.contains(evnt.target)) {
                setToggle(false)
            }
        }

        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click", handleClick);
    },[])

    

    const handleShare = async (post_id) => {
        let url = location.href+"post/"+post_id
        const shareData = {
            title: "EchoVain",
            text: "Check this post on EchoVain!",
            url
        };

        
        if (navigator.share) {
            try {
           
            if (navigator.canShare && !navigator.canShare(shareData)) {
                throw new Error("Cannot share this data");
            }

            await navigator.share(shareData);
            console.log("Shared successfully");
            } catch (error) {
            console.log("Share cancelled or failed:", error.message);
            }
        } else {
            showCustomShareModal(shareData.url);
        }
    }

    function showCustomShareModal(url) {
        const encodedURL = encodeURIComponent(url);
        const text = encodeURIComponent("Check this post on EchoVain!");

        window.open(
            `https://wa.me/?text=${text}%20${encodedURL}`,
            "_blank"
        );
    }

    
    return(
        <div className="crntTodo h-1/10 w-full flex items-center justify-around text-skin-ptext">
            <div name="" className="TodoInner">
                
                {postData && <div className="anmIcon">
                    <Suspense fallback={<div className="miniLoader"/>}>
                        <LikeCom Data={postData} />
                    </Suspense>
                </div>}
                
            </div>

            <div name="" className="TodoInner">
                
                {postData && <div className="anmIcon">
                    <Suspense fallback={<div className="miniLoader"/>}>
                        <DisLikeCom Data={postData} />
                    </Suspense>
                </div>}
                
            </div>
            
            <div className={`TodoInner ${canComment ? "" : "cursor-none pointer-events-none"}`}> <Link className="flex items-center justify-center gap-1" to={`/post/${post_id}`}
                state={{background:crntLocation}}
            >
                <CommentIcon className={`svgicon`} />
                    <span>{(canComment && likeCount) ? formatCount(totalComment) : ""}</span>
                </Link>
            </div>
            <div className={`TodoInner ${!canSave && "pointer-events-none"}`}  >
                {postData &&<Suspense fallback={<div className="miniLoader"/>}>
                        <SvCom Data={postData} />
                    </Suspense>}
                {/* <span>{likeCount ? formatCount(totalSave) : ""}</span> */}
            </div>
            <div ref={toggleRef} className="TodoInner relative">
                <i onClick={()=>{
                    images_url.length === 1 ? downloadAll() : setToggle(prev=>!prev);
                }}><DownloadIcon className={`svgicon`}/> </i>
                {
                    isToggle && <div className="flex items-center flex-col absolute bottom-1 z-50 p-2 border border-skin-ptext/30 bg-black/5 backdrop-blur-lg rounded-2xl"> 
                        <p onClick={()=>downloadAll(true)} className="border-b border-gray-500/50 p-2 text-nowrap">Only this </p>
                        <p onClick={()=>downloadAll(false)} className="border-b border-gray-500/50 p-2 text-nowrap">Download All {images_url.length}</p>
                    </div>
                }
            </div>
            
            <div className="TodoInner perspective-distant" onClick={()=>handleShare(post_id)}>
                <ShareIcon className={`svgicon`} />
            </div>
        </div>
    )
}