import React, { Suspense, useEffect, useRef, useState, useContext, useMemo, lazy } from "react"
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
import {btnContext} from './baseContainer.jsx';
import { debouncerGlob } from "../../../utils/debounceFun.js";
import TODOList from "../miniCom/TODOCompunent.jsx";
import  LikeCom  from "../miniCom/TODOComs/likeCom.jsx";
import DisLikeCom from "../miniCom/TODOComs/disLike.jsx";
import SvCom from "../miniCom/TODOComs/saveCom.jsx";
import CommentSkeleton from "./commentSkeL.jsx";
const PostOwnerEl = lazy(()=>import("../POinfo.jsx"));
import { KeyBoardSvg, PuchiSvg, SendSvg } from "../../../utils/SVG/menuSVG.jsx";
import { SmileEmoji } from "../../../utils/SVG/TODOsvg.jsx";

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


    const {id:uID, avatar} = UnivuUserInfo(stat=>stat.userInfo);
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
                console.log(result.OwnerInfo[0]);
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
                bg-violet-900/5 backdrop-blur-lg rounded-lg p-2.5 border border-amber-200/5">
                    <PostOwnerEl userInfo={{avatar:OwnerInfo.Oavatar,post_moment:OwnerInfo.post_moment, username:OwnerInfo.Ouser, ownerName:OwnerInfo.ownerName, isFollowing: OwnerInfo.isFollowing}}/>
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
                                    <CommentsContainer commentData={cmnt} crntPost={OwnerInfo} likeFun={handleLikes} delComment={handleDelete} acceptFun={handleApprove} />
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
                <div className="w-full h-15/100 absolute bottom-0 shadow rounded-md">
                    <div className="TodoList flex items-center justify-between text-skin-text h-1/2 bg-violet-900/5 backdrop-blur-lg w-9/10 ml-[5%] rounded-lg border border-amber-200/5">
                        {crntPostData && <> <div className="flex items-center gap-2.5">
                            <LikeCom Data={crntPostData}/>
                        <DisLikeCom Data={crntPostData} />
                        </div>
                        <div className="h-full w-10"><SvCom Data={crntPostData} /> </div> </>}
                    </div>
                    <div className="enterComment w-full h-1/2 relative p-2 flex items-center rounded-lg flex-row gap-2.5">
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
                        
                        <div className="absolute top-4 right-23.5  text-[20px] flex items-center justify-center cursor-pointer text-white" onClick={()=> {setEmoji(prev=>!prev), toggleMe(true)}}>
                             {isEmoji ? <KeyBoardSvg/> : <SmileEmoji/>}
                        </div>
                        <div className="avtDiv rounded-full h-10 w-10 relative">
                            <img src={avatar+"?size=40"} className="rounded-full" alt="" />
                            <div className="h-2.5 w-2.5 bg-green-600 absolute right-0.5 bottom-px rounded-full"/>
                        </div>
                        <form action="" className="h-full w-8/10 flex items-center justify-center">
                            <textarea autoCorrect="off" spellCheck={false} ref={commentRef} onClick={()=>setEmoji(false)}  className="my-scroll bg-black/80 rounded-lg p-2 resize-none text-skin-ptext h-full border border-violet-700/50  text-sm  placeholder:pt-px w-full placeholder:text-sm!" 
                                placeholder="Share your thought...">
                            </textarea>
                        </form>
                        <button
                        onClick={bounceNewComment}
                        className={`flex items-center justify-center w-15 rounded-md border border-blue-800/50
                    cursor-pointer hover:text-white hover:scale-95 duration-300 bg-indigo-900/50`}
                        
                        ><div className="h-full w-full  text-skin-ptext hover:text-skin-text"> <SendSvg className="text-3xl ml-4.5"/>
                        </div></button>
                    </div>
                </div>
            </div> : "Comment not allow"}
        </div>
    )
}