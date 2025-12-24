import React, { Suspense, useState } from "react"
import { useParams } from "react-router-dom";
const EmojiPicker = React.lazy(()=>import("emoji-picker-react"));
import {toast} from 'react-toastify'
export default function CommentEl({commentData}) {
    const [isEmoji,setEmoji] = useState(false);
    const [text,setText] = useState("");
    const {pID} = useParams();
    
    const handleSubmit = async () => {
        try {
            if (text.length > 300) throw new Error("Comment is too big");
            
            if(text.length<1) throw new Error("Text.length will be > 0");
            
            let rqst = await fetch("/myServer/writePost/addComment",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({text,post_id:commentData[0].post_id,pID})
            });
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            setText("");
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleLike = async (commentID,post_id) => {
        console.log("i am in fun",commentID,post_id)
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
            console.log(result)
        } catch (error) {
            toast.error(error.message);
        }
    }
    return(
        <>
       {  commentData?.length < 1 ? <div className="miniLoader h-20! w-20! rounded-full"></div> :
         <div className="underTaker">
            <div className="h-full w-full mainInnerCC flex items-center flex-col p-1">
                <div className="virtuoso h-9/10 w-full flex items-center justify-center flex-wrap gap-4 my-scroll">
                    {
                        commentData.map((cmnt)=>{
                            let {username,avatar,commentID,comment,post_id,isLiked,totalLike} = cmnt;
                            return(
                                <div key={commentID} className="h-auto w-full text-skin-text flex items-center flex-col">
                                    <div className="layerOne flex items-center justify-start w-full h-auto">
                                        <div className="userAndComment flex items-start gap-2 w-[93%] p-2">
  
                                            <img
                                                src={`/myServer${avatar}`}
                                                className="h-10 w-10 rounded-full shrink-0"
                                                alt=""
                                            />

                                            <div className="flex flex-col gap-2">
                                                <span className="font-semibold">{username}</span>
                                                <p className="text-wrap wrap-break-words">{comment}</p>
                                            </div>

                                        </div>

                                        <div className="likeCommentd flex items-center justify-center w-[7%]">
                                            <i onClick={()=>handleLike(commentID,post_id)} className={isLiked ? "bx bxs-heart text-rose-500 cursor-pointe" : "bx bx-heart cursor-pointer text-gray-500"}></i>
                                        </div>
                                    </div>
                                    <div className="layerTwo flex items-center w-full pl-10  justify-start text-gray-500 text-[13px] gap-4">
                                        <i>{`${totalLike} like`}</i>
                                        <i>10s ago</i>
                                        <i>Report</i>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="enterComment w-full h-1/10 relative p-2 flex items-center flex-row">
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
                    <i className={`bx bxs-${isEmoji ? "keyboard" : "smile"} absolute top-2 text-2xl cursor-pointer text-white`} onClick={()=>setEmoji(prev=>!prev)}></i>
                    <form action="" className="h-full w-9/10">
                        <textarea value={text} onChange={(evnt)=>{
                                setText(evnt.target.value)
                            }} onClick={()=>setEmoji(false)}  className="my-scroll border-none outline-none p-1 resize-none text-skin-ptext h-full pl-10 text-[16px]  placeholder:pl-2 w-full" 
                            placeholder="Share your thought...">
                        </textarea>
                    </form>
                    <button
                    onClick={handleSubmit}
                    className={`postCommitBtn flex items-center justify-center w-20 bg-linear-to-r from-purple-500 via-blue-500 to-purple-600
                    p-1 cursor-pointer bg-size-[200%_200%] hover:bg-position-[100%_150%]  transition-all duration-700 ease-in-out overflow-hidden rounded-lg`}
                    
                    ><div className="text-md h-full w-full font-bold text-white"><span>Send</span> <i className="bx bxs-send -rotate-45"></i>
                     </div></button>
                </div>
            </div>
        </div>}
        </>
    )
}