import React, { Suspense, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
const EmojiPicker = React.lazy(()=>import("emoji-picker-react"));
import {toast} from 'react-toastify'
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo";
import { Loader } from "../../../lib/loader";
import sound from "../../../assets/Sounds/star.mp3"
import CommentsContainer from "./comment";
import { Virtuoso } from "react-virtuoso";
import socket from "../../../utils/socket";
import { m } from "framer-motion";

let logicObj = {
    isFeching:true,
    isAllow:false
}
export default function CommentEl() {
    const [isEmoji,setEmoji] = useState(false);
    const {pID} = useParams();
    const isLoader = Loader(stat => stat.isTrue);
    const [offset,setOffset] = useState(0);
    const [commentData,setComment] = useState({
            commentIds: [],
            commentsById: {}
        });
    const [isOver,setOver] = useState(false);
    const commentRef = useRef(null);
    let {setUnivPost} = univPostStore();
    const crntPostData = univPostStore(stat=>stat.postsById[pID]);

    const [canComment,setCanComnt] = useState(true);

    const soundMp3 = new Audio(sound)

    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    let  {isTrue,toggleLoader}  = Loader();

    function optimizeComment(prevState, newArray) {
        const newIds = [...prevState.commentIds];
        const newById = { ...prevState.commentsById };

        for (const cmnt of newArray) {
            if (!newById[cmnt.commentID]) {
            newIds.push(cmnt.commentID);
            }

            newById[cmnt.commentID] = {
            ...newById[cmnt.commentID],
            ...cmnt
            };
        }

        return {
            commentIds: newIds,
            commentsById: newById
        };
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
            if (result.commentrows.length>0) {
                setComment(prev=>optimizeComment(prev,result.commentrows));
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
        logicObj = {
            isFeching:true
        }
        if (isOver) return;
        if(isTrue) return;
        toggleLoader(true);
        try {
            let rqst = await fetch(`/myServer/readPost/getComment?limit=20&offset=${offset}&post_id=${postID}`);
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            // setComment(prev=>[...prev,...result.commentrows]);
            setComment(prev=>optimizeComment(prev,result.commentrows));
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
        if (commentData?.commentIds?.length > 1) return;
        getComments(pID)
    },[pID]);

    const handleLikes = ({commentID: CId, like}) =>{
    
            setComment(prev => {
                const current = prev.commentsById[CId];
                if (!current) return prev;

                return {
                    ...prev,
                    commentsById: {
                        ...prev.commentsById,
                        [CId]: {
                            ...current,
                            isLiked: like,
                            totalLike: like
                                ? current.totalLike + 1
                                : current.totalLike - 1
                        }
                    }
                };
            });

                soundMp3.play();
        };



        const handleDelete = (newData) => {
            let {commentID,post_id} = newData;
                let newCommentData = commentData.filter(cmnt=> cmnt.commentID !== commentID);
                setComment(newCommentData);
            soundMp3.play();
            let {totalComment} = postsById[post_id]
            setUnivPost({
                [post_id]:{
                    totalComment: totalComment - 1
                }
            })
        }

        useEffect(()=>{
            const handleComments = (newData) => {
                let {post_id:pid,id} = newData;
                let {totalComment} = crntPostData;
                if (pID === pid && id === uID) {
                    
            }
            setUnivPost({
                [pID]:{
                    totalComment: totalComment + 1
                }
            })
            
            soundMp3.play();
        }

        socket.on("newComment",handleComments);
        return ()=> socket.off("newComment",handleComments);
        },[crntPostData])


    
    const handleSubmit = async () => {
        setEmoji(false)
        let text = commentRef.current.value
        try {
            if (text.length > 300) throw new Error("Comment is too big");
            
            if(text.length<1) throw new Error("Text.length will be > 0");
            setComment(prev=>[{inProcess:true},...prev])
            
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
            commentRef.current.value = ""
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleApprove = (comment_id) => {
        setComment(prev => {
            prev.map(obj=>{
                if (comment_id !== obj.commentID) return obj;
                return {
                    ...obj,
                    isAccepted:true
                }
            })
        })
    }

    
    return(
         <div className="underTaker">
            {canComment ? <div 
             className={`h-full w-full mainInnerCC comment-sheet flex items-center flex-col p-1 touch-none`}>
                
                <div className="virtuoso mt-2 relative h-9/10 w-full flex items-start justify-start flex-wrap gap-4">
                    {
                       commentData?.commentIds?.length > 0 ?
                       <Virtuoso 
                        style={{
                            height:"100%",
                            width:"100%"
                        }}
                        className="my-scroll"
                        totalCount={commentData.commentIds.length}
                       

                        itemContent={(index) => {
                            const comment_id = commentData.commentIds[index];
                            const cmnt = commentData.commentsById[comment_id];
                            return (
                                <div className="h-full w-full flex justify-center">
                                    <CommentsContainer commentData={cmnt} likeFun={handleLikes} delComment={handleDelete} />
                                </div>
                            )
                        }}

                        endReached={()=> {
                            if (!isOver) {
                                getMoreComments(pID)
                            }
                        }}
                        components={{
                            Footer: ()=>(
                                <div className="h-20 w-full flex justify-center items-center">
                                    {isLoader ? (
                                        <div className="miniLoader"></div>
                                    ):(
                                        <p className="text-skin-text/20">No more Comment</p>
                                    )}
                                </div>
                            )
                        }}
                        increaseViewportBy={400}
                      /> : <div className="text-skin-ptext h-full w-full flex items-center justify-center">
                         <div className="miniLoader"></div>
                         <p>No Comment Yet</p>
                      </div>
                    }
                </div>
                <div className="w-full h-1/10 absolute bottom-0">
                    <div className="enterComment w-full h-full relative p-2 flex items-center flex-row">
                        {
                            isEmoji && 
                            <Suspense fallback={null} >
                                <div id="emojiDiv" className="p-1 absolute left-0 bottom-10 w-full">
                                    <EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
                                        let prevText = commentRef.current.value
                                        commentRef.current.value = prevText + emoji.emoji
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
                            <textarea ref={commentRef} onClick={()=>setEmoji(false)}  className="my-scroll border-none outline-none p-1 resize-none text-skin-ptext h-full pl-10 text-[16px]  placeholder:pl-2 placeholder:pt-2 w-full" 
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