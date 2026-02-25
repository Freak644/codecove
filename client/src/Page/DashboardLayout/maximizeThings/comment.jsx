import React, { useEffect, useRef, useState } from "react";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import { toast } from "react-toastify";
import {Link} from "react-router-dom"
import {useContext} from 'react';
import {btnContext} from './baseContainer';
import CommentSkeleton from "./commentSkeL";

export default function CommentsContainer({commentData,likeFun,delComment}) {
    let {username,inProcess,avatar,isPostOwner, isReported,commentID,isAccepted,post_moment,comment,post_id,isLiked,id,totalLike,created_at} = commentData;
    const toggelBtn = useContext(btnContext);

    const flotRef = useRef({});
    const setCallback = (id)=> (el)=>{
        flotRef.current[id]=el;
    }
    const [isFloating,setFloting] = useState({
        float:false,
        clickID:""
    });

        const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const timeAgoIntl = (dateString) => {
        const diff = (new Date(dateString) - new Date()) / 1000;

        if (Math.abs(diff) < 60)
            return rtf.format(Math.round(diff), "second");

        if (Math.abs(diff) < 3600)
            return rtf.format(Math.round(diff / 60), "minute");

        if (Math.abs(diff) < 86400)
            return rtf.format(Math.round(diff / 3600), "hour");

        return rtf.format(Math.round(diff / 86400), "day");
    }

    const handleLike = async (commentID,post_id,like) => {
        if (!commentID || !post_id) return;
        let newLike = !like
        try {
            if (!commentID.trim() || !post_id.trim()) throw new Error("Invalid info");
            likeFun({commentID,like:newLike})
            let rqst = await fetch("/myServer/writePost/addLikeComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID,post_id})
            })
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);

        } catch (error) {
            toast.error(error.message);
        }
    }

    // const secondLastRef = (node) => {
    //     if (observerRef.current) observerRef.current.disconnect();

    //     observerRef.current = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting) {
    //                 getMoreComments(pID);
    //             }
    //         },
    //         {
    //             root: null,
    //             threshold: 0.1,
    //         }
    //     );

    //     if (node) observerRef.current.observe(node);
    // };


    const reportComment = async (comment_id,post_id) => {
        toggelBtn(true)
        try {
            let rqst = await fetch("/myServer/writePost/reportComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID:comment_id,post_id})
            });
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            toast.success(result.pass);
      
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteComment = async (comment_id,post_id) => {
        toggelBtn(true)
        try {
            if (!comment_id.trim() || !post_id.trim()) throw new Error("Invalid info");
            delComment({commentID:comment_id,post_id})
            let rqst = await fetch("/myServer/writePost/deleteComment",{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID:comment_id,post_id})
            });
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            toast.success(result.pass);
        } catch (error) {
            toast.error(error.message)
        }
    }

    const acceptSolution = async (comment_id) => {
        toggelBtn(true)
        try {
            if (!comment_id || !comment_id.trim()) throw new Error("Invalid Info");
            
            let rqst = await fetch("/myServer/writeAchievement/acceptComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID:comment_id})
            })
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            toast.success(result.pass)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        const handleClick = evnt=>{
            const el = flotRef.current[isFloating.clickID];
            if (el && !el.contains(evnt.target)) {
                setFloting({clickID:"",float:false});
            }
        }
        
        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click",handleClick);
    },[isFloating])

    
    return(
            <>{ inProcess ? <CommentSkeleton/> :
                <div key={commentID} className="h-auto mt-2.5 w-full text-skin-text flex items-center flex-col">
                    <div className="layerOne flex items-center justify-start w-full h-auto">
                        <div className="userAndComment flex items-start gap-2 w-[93%] p-2">
                            <Link className="flex items-start" to={`/Lab/${username}`}>
                                <img
                                    src={`/myServer${avatar}`}
                                    className="h-10 w-10 rounded-full shrink-0"
                                    alt=""
                                />
                            </Link>
                            <div className="flex flex-col gap-2">
                                <Link className="flex items-center gap-1.5" to={`/Lab/${username}`}>
                                    <span className="font-semibold">{username}</span>
                                    {isAccepted ? <i title="Comment accept by Post Owner" className="bx bxs-badge-check text-green-400"></i> : ""}
                                </Link>
                                <p className="text-wrap wrap-break-words pointer-events-none">{comment}</p>
                            </div>
                        </div>
                        <div className="likeCommentd flex items-center flex-col gap-2 w-[7%] text-lg">
                            <div className="relative" ref={setCallback(commentID)}>
                                <i className="bx bx-dots-vertical text-gray-500 cursor-pointer" onClick={()=>setFloting({float:true,clickID:commentID})}></i>
                                <div className={`flex absolute right-0 transition-all duration-300 ${(isFloating.float && isFloating.clickID === commentID) ? "top-0! opacity-100" : "-top-5 opacity-0 pointer-events-none "} p-1 rounded-md bg-blue-500/20 backdrop-blur-md`}>
                                    <ul>
                                        <li className="border-b m-1 text-gray-500"><i onClick={()=>{
                                            if (isReported) return;
                                            reportComment(commentID,post_id);
                                        }} className="bx bxs-report cursor-pointer">{isReported ? "Reported" : "Report"}</i></li>
                                        {(uID === id || isPostOwner) ? <li className="border-b m-1 text-red-500"><i onClick={()=>deleteComment(commentID,post_id)} className="bx bx-trash cursor-pointer">Delete</i></li> : ""}
                                        {(isPostOwner && post_moment === "Bugs" && !isAccepted) ? <li onClick={()=>acceptSolution(commentID)} className="border-b m-1 text-nowrap cursor-pointer text-green-400"><i className="bx bxs-badge-check"></i>Accepte</li> : ""}
                                    </ul>
                                </div>
                            </div>
                            <i onClick={()=>handleLike(commentID,post_id,isLiked)} className={isLiked ? "bx bxs-heart text-rose-500 cursor-pointer" : "bx bx-heart cursor-pointer text-gray-500"}></i>
                        </div>
                    </div>
                    <div className="layerTwo flex items-center w-full pl-10  justify-start text-gray-500 text-[13px] gap-4">
                        <i className="bx">{`${totalLike} like`}</i>
                        <i className="bx">{timeAgoIntl(created_at)}</i>
                    </div>
                </div>}
            </>
    )
}