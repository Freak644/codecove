import React, { Suspense, useEffect, useRef, useState, useContext, useMemo } from "react"
import { useParams } from "react-router-dom";
const EmojiPicker = React.lazy(()=>import("emoji-picker-react"));
import {toast} from 'react-toastify'
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo";
import { Loader } from "../../../lib/loader";
import {starAudio} from '../../../utils/sound.js'
import CommentsContainer from "./comment";
import { Virtuoso } from "react-virtuoso";
import socket from "../../../utils/socket";
import { calcGeneratorDuration, m } from "framer-motion";
import { FaKeyboard, FaSmile } from "react-icons/fa";
import {btnContext} from './baseContainer.jsx';
import { IoSend } from "react-icons/io5";
import { debouncerGlob } from "../../../utils/debounceFun.js";
import TODOList from "../miniCom/TODOCompunent.jsx";
import  LikeCom  from "../miniCom/TODOComs/likeCom.jsx";
import DisLikeCom from "../miniCom/TODOComs/disLike.jsx";
import SvCom from "../miniCom/TODOComs/saveCom.jsx";
import CommentSkeleton from "./commentSkeL.jsx";

let logicObj = {
    isFeching:true,
    isAllow:false
}

export default function CommentEl() {
    const [isEmoji,setEmoji] = useState(false);
    const [OwnerInfo,setOwnerInfo] = useState({})
    const toggelBtn = useContext(btnContext);    
    const [noComments,toggleNoCommetn] = useState(false);
    const toggleMe = toggelBtn?.setToggel || ((arg) => console.log(arg));
    let {pID} = useParams();
    if (!pID) {
        pID = useContext(paramPost);
    }
    const isLoader = Loader(stat => stat.isTrue);
    const [cursor,setCursor] = useState({});
    const [commentData,setComment] = useState({
            commentIds: [],
            commentsById: {}
        });
    const [isOver,setOver] = useState(false);
    const commentRef = useRef(null);
    let {setUnivPost} = univPostStore();
    const crntPostData = univPostStore(stat=>stat.postsById[pID]);

    const [canComment,setCanComnt] = useState(true);


    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    let  {toggleLoader}  = Loader();

    function optimizeComment(prevState, newArray, isPush) {
            const newIds = [...prevState.commentIds];
            const newById = { ...prevState.commentsById };

            const idsToAdd = [];

            for (const cmnt of newArray) {
                if (!newById[cmnt.commentID]) {
                    idsToAdd.push(cmnt.commentID);
                }

                newById[cmnt.commentID] = {
                    ...newById[cmnt.commentID],
                    ...cmnt
                };
            }



            return {
                commentIds: isPush
                    ? [...idsToAdd, ...newIds]   // top
                    : [...newIds, ...idsToAdd],  // bottom

                commentsById: newById
            };
    }

    
    
    useEffect(()=>{
        console.log(commentData.commentIds.length)
    },[commentData])
    const getComments = async (postID) => {
        if (isOver) return;
        toggleLoader(true);
        try {
            let rqst = await fetch(`/myServer/readPost/getComment?limit=20&&post_id=${postID}`);
            let result = await rqst.json();
            if (result.err) {
                if (!result.isComment) setCanComnt(result.isComment)
                throw new Error(result.err);
            }

            
                setOwnerInfo(result.OwnerInfo[0]);
                setCursor(result.cursorObj)
                if (result.commentrows.length === 0) toggleNoCommetn(true);
                setComment(prev=>optimizeComment(prev,result.commentrows,false));
            
            if (!result.hasMore) {
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
        if(isLoader) return;
        toggleLoader(true);
        try {
            let rqst = await fetch(`/myServer/readPost/getComment?limit=20&cursorComment_sr=${cursor.cursorComment_sr}&post_id=${postID}`);
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            // setComment(prev=>[...prev,...result.commentrows]);
            console.log(result.commentrows)
            setComment(prev=>optimizeComment(prev,result.commentrows,false));
            setCursor(result.cursorObj)
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
        // console.log("here");
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

                starAudio.currentTime = 0;
                starAudio.play();
        };



        const handleDelete = (newData) => {
            let {commentID,post_id} = newData;
            setComment(prev=>{
                let {[commentID]:_,...rest} = prev.commentsById;
                
                return {
                    commentIds: prev.commentIds.filter(id=> id !== commentID),
                    commentsById:rest
                }
            })
            let {totalComment} = postsById[post_id]
            setUnivPost({
                [post_id]:{
                    totalComment: totalComment - 1
                }
            })
        }

        useEffect(()=>{
            const handleComments = (newData) => {
                
                if (crntPostData) {
                    let {totalComment} = crntPostData;
                    setUnivPost({
                    [pID]:{
                            totalComment: totalComment + 1
                        }
                    });
                }
            
                setComment(prev=>optimizeComment(prev,[newData],true));
            
            starAudio.currentTime = 0;
            starAudio.play();
        }

        socket.on("newComment",handleComments);
        return ()=> socket.off("newComment",handleComments);
        },[crntPostData])


    
    const handleSubmit = async () => {
        setEmoji(false)
        let text = commentRef.current.value
        try {
            if (text.length > 400) throw new Error("Comment is too big only 400 L Allow");
            
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
            starAudio.currentTime = 0;
            starAudio.play();
            commentRef.current.value = ""
        } catch (error) {
            toast.error(error.message);
        }
    }

    const bounceNewComment = useMemo(()=> {
        return debouncerGlob(handleSubmit);
    },[])
    const handleApprove = (comment_id) => {
        setComment(prev => ({
            ...prev,
            ...prev.commentsById,
            [comment_id]:{
                isAccepted:true
            }
        }))
    }

    
    return(
         <div className="underTaker">
            {canComment ? <div 
             className={`h-full w-full mainInnerCC comment-sheet flex items-center flex-col p-1 touch-none`}>
                <div className="userInfoHeader w-full h-1/10 flex items-center flex-row gap-2.5
                bg-gray-800 rounded-lg p-2.5">
                    <img className="h-9 w-9 rounded-full bg-gray-600" loading="lazy" src={OwnerInfo.Oavatar+"?size=36"} alt="DP" />
                    <span className="text-skin-text">{OwnerInfo.Ouser}</span>
                    <p className="text-blue-500">{OwnerInfo.isFollowing ? "Unfollow" : "Follow"}</p>
                </div>
                <div className="virtuoso mt-2 relative h-9/12 w-full flex items-start justify-start flex-wrap gap-4">
                    {
                       (commentData.commentIds.length !== 0 || noComments) ?
                       <Virtuoso 
                        style={{
                            height:"100%",
                            width:"100%"
                        }}
                        className="my-scroll pointer-events-none"
                        totalCount={commentData.commentIds.length}
                       

                        itemContent={(index) => {
                            const comment_id = commentData.commentIds[index];
                            const cmnt = commentData.commentsById[comment_id];
                            return (
                                <div className="h-full w-full flex justify-center">
                                    <CommentsContainer commentData={cmnt} likeFun={handleLikes} delComment={handleDelete} acceptFun={handleApprove} />
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
                      /> : [...Array(10)].map((_,index)=> (
                        <div className="p-px w-full" key={index}>
                            <CommentSkeleton/>
                        </div>
                      ))
                    }
                </div>
                <div className="w-full h-15/100 absolute bottom-0 shadow bg-gray-700/60 backdrop-blur-lg rounded-md">
                    <div className="TodoList flex items-center justify-between text-skin-text h-1/2 w-full">
                        {crntPostData && <> <div className="flex items-center gap-2.5">
                            <LikeCom Data={crntPostData}/>
                        <DisLikeCom Data={crntPostData} />
                        </div>
                        <div className="h-full w-10"><SvCom Data={crntPostData} /> </div> </>}
                    </div>
                    <div className="enterComment w-full h-1/2 relative p-2 flex items-center rounded-lg flex-row ">
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
                        
                        <div className="absolute top-4 left-4  text-[20px] flex items-center justify-center cursor-pointer text-white" onClick={()=> {setEmoji(prev=>!prev), toggleMe(true)}}>
                             {isEmoji ? <FaKeyboard/> : <FaSmile/>}
                        </div>
                        <form action="" className="h-full w-9/10 flex items-center justify-center">
                            <textarea ref={commentRef} onClick={()=>setEmoji(false)}  className="my-scroll bg-black/80 rounded-lg p-1 resize-none text-skin-ptext h-full border border-amber-50 pl-10 text-[16px]  placeholder:pl-2 placeholder:pt-px w-full" 
                                placeholder="Share your thought...">
                            </textarea>
                        </form>
                        <button
                        onClick={bounceNewComment}
                        className={`flex items-center justify-center w-18 p-1 cursor-pointer`}
                        
                        ><div className="h-full w-full  text-skin-ptext hover:text-skin-text"> <IoSend className="text-3xl ml-4"/>
                        </div></button>
                    </div>
                </div>
            </div> : "Comment not allow"}
        </div>
    )
}