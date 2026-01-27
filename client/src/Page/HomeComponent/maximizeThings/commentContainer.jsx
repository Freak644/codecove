import React, { Suspense, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
const EmojiPicker = React.lazy(()=>import("emoji-picker-react"));
import {toast} from 'react-toastify'
import socket from "../../../utils/socket";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import { Loader } from "../../../lib/loader";
import sound from "../../../assets/Sounds/star.mp3"
export default function CommentEl() {
    const [isEmoji,setEmoji] = useState(false);
    const [text,setText] = useState("");
    const {pID} = useParams();
    const [offset,setOffset] = useState(0);
    const [commentData,setComment] = useState([]);
    const [isOver,setOver] = useState(false);
    const [Ty,setTy] = useState(0);
    const [isDragging,setDrag] = useState(false);
    const [canComment,setCanComnt] = useState(true);
    const MAX_DRAG = 300;
    const soundMp3 = new Audio(sound)

    const progress = Math.min(Ty / MAX_DRAG, 1);


    const startY = useRef(0);
    const currentY = useRef(0);
    const sheetRef = useRef(null);

    const navi = useNavigate();

    const observerRef = useRef(null);
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    let  {isTrue,toggleLoader}  = Loader();
    
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

    const getComments = async (postID) => {
        if (isOver) return;
        if(isTrue) return;
        toggleLoader(true);
        try {
            let rqst = await fetch(`/myServer/readPost/getComment?limit=20&offset=${offset}&post_id=${postID}`);
            let result = await rqst.json();
            if (result.err) {
                if (!result.isComment) setCanComnt(result.isComment)
                throw new Error(result.err)
            }
            console.log({commentDataIS:result.commentrows})
            if (result.commentrows.length>0) {
                setComment(result.commentrows);
            }
            setOffset(20)
            if (result.commentrows?.length < 20) {
                setOver(true);
            }
        } catch (error) {
            toast.error(error.message);
        }finally{
            toggleLoader(false);
        }
    }
    const getMoreComments = async (postID) => {
        if (isOver) return;
        if(isTrue) return;
        toggleLoader(true);
        try {
            let rqst = await fetch(`/myServer/readPost/getComment?limit=20&offset=${offset}&post_id=${postID}`);
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            setComment(prev=>[...prev,...result.commentrows]);
            
            setOffset(prev=>prev+20)
            if (result.commentrows.length < 20) {
                setOver(true);
            }
        } catch (error) {
            toast.warning(error.message);
        }finally{
            toggleLoader(false);
        }
    }
    
    useEffect(()=>{
        if (commentData?.length > 1) return;
        getComments(pID)
    },[pID]);

    useEffect(()=>{
        // if (commentData.length<1) return;
        // console.log(commentData.length)
        socket.emit("joinPost",pID);
        const handleLikes = ({commentID: CId,post_id:pid, user_id,like}) =>{
            // console.log(user_id,like)
            if (pID === pid) {
                setComment(prev =>
                    prev.map(obj => {
                        if (CId !== obj.commentID) return obj;
                        return {
                        ...obj,
                        totalLike: like ? obj.totalLike ++ : obj.totalLike --,
                        isLiked: user_id === uID ? like : obj.isLiked
                        };
                    })
                );
            }
        };

        const handleComments = (newData) => {
            let {post_id:pid,id} = newData;
            if (pID === pid && id === uID) {
                setComment(prev=>[newData,...prev]);
            }
        }

        const handleDelete = (newData) => {
            let {post_id:pid,commentID,id} = newData;
            if (pID === pid && id === uID) {
                let newCommentData = commentData.filter(cmnt=> cmnt.commentID !== commentID);
                setComment(newCommentData)
            }
        }
        socket.on("deleteComment",handleDelete);
        socket.on("newCommentLike",handleLikes);
        socket.on("newComment",handleComments);
        return () => {
            socket.emit("leavePost",pID);
            socket.emit("deleteComment",handleDelete);
            socket.off("newComment",handleComments);
            socket.off("newCommentLike",handleLikes);
        }
    },[commentData])

    
    const handleSubmit = async () => {
        setEmoji(false)
        try {
            if (text.length > 300) throw new Error("Comment is too big");
            
            if(text.length<1) throw new Error("Text.length will be > 0");
            
            let rqst = await fetch("/myServer/writePost/addComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({text,pID})
            });
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            soundMp3.play()
            setText("");
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleLike = async (commentID,post_id) => {
        if (!commentID || !post_id) return;
        try {
            let rqst = await fetch("/myServer/writePost/addLikeComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID,post_id})
            })
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            soundMp3.play()
        } catch (error) {
            toast.error(error.message);
        }
    }

    const secondLastRef = (node) => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    getMoreComments(pID);
                }
            },
            {
                root: null,
                threshold: 0.1,
            }
        );

        if (node) observerRef.current.observe(node);
    };

    const onStart = (evnt)=> {
        const isAtTop = sheetRef.current?.scrollTop === 0;
        if (!isAtTop) return;

        const y = evnt.touches ? evnt.touches[0].clientY : evnt.clientY;
        startY.current = y;
        if (y>0) {
            setDrag(true);
        }
        
    }

    const onDraggin = (evnt) => {
            if (!isDragging) return;

            const y = evnt.touches ? evnt.touches[0].clientY : evnt.clientY;
            let diff = y - startY.current;

            if (diff <= 0) return;

            // 👇 resistance after 120px
            if (diff > 120) {
                diff = 120 + (diff - 120) * 0.35;
            }

            setTy(Math.min(diff, MAX_DRAG));
    };


    const onExit = (evnt) => {
        setDrag(false);
        if (Ty > 100) {
            navi(-1);
        }
    }

    const reportComment = async (comment_id,post_id) => {
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
            soundMp3.play()
        } catch (error) {
            toast.error(error.message);
        }
    }

    const deleteComment = async (comment_id,post_id) => {
        try {
            if (!comment_id.trim() || !post_id.trim()) throw new Error("Invalid info");
            
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
            soundMp3.play()
        } catch (error) {
            toast.error(error.message)
        }
    }

    const acceptSolution = async (comment_id,post_id) => {
        try {
            if (post_id || comment_id || !comment_id.trim() || !post_id.trim()) throw new Error("Invalid Info");
            
            let rqst = await fetch("/myServer/writePost",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({commentID:comment_id,post_id})
            })
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    return(
         <div className="underTaker">
            {canComment ? <div onTouchStart={onStart}
            onMouseDown={onStart}
            onTouchMove={onDraggin}
            onMouseMove={onDraggin}
            onMouseUp={onExit}
            onTouchEnd={onExit}
             ref={sheetRef}
             
             style={{
                        transform: `
                            translateY(${Ty}px)
                            scale(${1 - progress * 0.03})
                        `,
                        boxShadow: `0 ${10 + progress * 20}px ${
                            40 + progress * 40
                        }px rgba(0,0,0,${0.25 + progress * 0.25})`,
                        transition: isDragging ? "none" : "transform 0s ease, box-shadow 0.3s ease"
                    }}

             
             
             className={`h-full w-full mainInnerCC flex items-center flex-col p-1 touch-none`}>
                    <div className="h-1.5 w-16 bg-skin-login absolute top-0 rounded-md md:hidden" />
                <div className="virtuoso mt-2 relative h-9/10 w-full flex items-start justify-items-start flex-wrap gap-4 my-scroll">
                    {
                       commentData?.length > 0 ?
                        commentData?.map((cmnt,index)=>{
                            let {username,avatar,isPostOwner,commentID,isAccepted,comment,post_id,isLiked,id,totalLike,created_at} = cmnt;
                            let isSecondLast = index === commentData.length-2;
                            return(
                                <div key={commentID} ref={isSecondLast ? secondLastRef : null} className="h-auto w-full text-skin-text flex items-center flex-col">
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

                                        <div className="likeCommentd flex items-center flex-col w-[7%]">
                                            
                                            <i onClick={()=>handleLike(commentID,post_id)} className={isLiked ? "bx bxs-heart text-rose-500 cursor-pointer" : "bx bx-heart cursor-pointer text-gray-500"}></i>
                                        </div>
                                    </div>
                                    <div className="layerTwo flex items-center w-full pl-10  justify-start text-gray-500 text-[13px] gap-4">
                                        <i className="bx">{`${totalLike} like`}</i>
                                        <i className="bx">{timeAgoIntl(created_at)}</i>
                                        <i onClick={()=>reportComment(commentID,post_id)} className="bx bxs-report cursor-pointer">Report</i>
                                        {(uID === id || isPostOwner) && <i onClick={()=>deleteComment(commentID,post_id)} className="bx bx-trash cursor-pointer"></i>}
                                    </div>
                                </div>
                            )
                        }) : <div className="text-skin-ptext">Be the first commenter...💬</div>
                    }
                </div>
                <div className="w-full h-1/10 absolute bottom-0">
                    <div className="enterComment w-full h-full relative p-2 flex items-center flex-row">
                        {
                            isEmoji && 
                            <Suspense fallback={null} >
                                <div id="emojiDiv" className="p-1 absolute left-0 bottom-10 w-full">
                                    <EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
                                        setText(prev=>prev + emoji.emoji)
                                    }
                                    } lazyLoadEmojis
                                    skinTonePickerLocation="PREVIEW"
                                    previewConfig={{showPreview:false}} >

                                    </EmojiPicker>
                                </div>
                            </Suspense>
                        }
                        <i className={`bx bxs-${isEmoji ? "keyboard" : "smile"} absolute top-4 text-2xl cursor-pointer text-white`} onClick={()=>setEmoji(prev=>!prev)}></i>
                        <form action="" className="h-full w-9/10">
                            <textarea value={text} onChange={(evnt)=>{
                                    setText(evnt.target.value)
                                }} onClick={()=>setEmoji(false)}  className="my-scroll border-none outline-none p-1 resize-none text-skin-ptext h-full pl-10 text-[16px]  placeholder:pl-2 placeholder:pt-2 w-full" 
                                placeholder="Share your thought...">
                            </textarea>
                        </form>
                        <button
                        onClick={handleSubmit}
                        className={`postCommitBtn flex items-center justify-center w-22 bg-linear-to-r from-purple-500 via-blue-500 to-purple-600
                        p-1 cursor-pointer bg-size-[200%_200%] hover:bg-position-[100%_150%]  transition-all duration-700 ease-in-out overflow-hidden rounded-lg`}
                        
                        ><div className="text-md h-full w-full font-bold text-white"><span>Send</span> <i className="bx bxs-send -rotate-45"></i>
                        </div></button>
                    </div>
                </div>
            </div> : "Comment not allow"}
        </div>
    )
}