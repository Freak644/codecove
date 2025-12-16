import { Emoji } from "emoji-picker-react";
import { useScroll } from "framer-motion";
import React, { Suspense, useState } from "react"
const EmojiPicker = React.lazy(()=>import("emoji-picker-react"));
export default function CommentEl() {
    const [isEmoji,setEmoji] = useState(false);
    const [text,setText] = useState("");
    return(
        <div className="underTaker">
            <div className="h-full w-full mainInnerCC flex items-center flex-col p-1">
                <div className="virtuoso border border-amber-200 h-9/10 w-full flex items-center justify-center flex-wrap gap-4">

                </div>
                <div className="enterComment w-full h-1/10 border-red-500 border relative p-2 flex items-center flex-row">
                    {
                        isEmoji && 
                        <Suspense fallback={null} >
                            <div className="p-1 absolute bottom-10 w-full">
                                <EmojiPicker theme="dark" onEmojiClick={(emoji)=>{
                                    setText(prev=>prev + emoji.emoji)
                                    setEmoji(false)
                                }
                                } lazyLoadEmojis
                                skinTonePickerLocation="PREVIEW"
                                previewConfig={{showPreview:false}} >

                                </EmojiPicker>
                            </div>
                        </Suspense>
                    }
                    <i className="bx bxs-smile absolute text-2xl cursor-pointer text-white" onClick={()=>setEmoji(prev=>!prev)}></i>
                    <textarea value={text} onChange={(evnt)=>{
                        setText(evnt.target.value)
                    }}  name="" id="" className="my-scroll p-1 resize-none text-skin-ptext h-full pl-10 text-[16px] border-none outline-none placeholder:pl-2 w-9/10" 
                    placeholder="Share your thought...">
                    </textarea>
                    <button
                    className={`postCommitBtn flex items-center justify-center w-20 bg-linear-to-r from-purple-500 via-blue-500 to-pink-600
                    p-1 cursor-pointer bg-size-[200%_200%] hover:bg-position-[100%_150%]  transition-all duration-700 ease-in-out overflow-hidden rounded-lg`}
                    
                    ><div className="text-md h-full w-full font-bold text-white"><span>Send</span> <i className="bx bxs-send -rotate-45"></i>
                     </div></button>
                </div>
            </div>
        </div>
    )
}