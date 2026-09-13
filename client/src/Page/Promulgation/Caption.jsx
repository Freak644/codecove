import { Suspense, useState, lazy } from "react"
import { HashtagIcon, SmileEmoji } from "../../utils/SVG/TODOsvg";
import { AltMail } from "../../utils/SVG/menuSVG";
const EmojiPicker = lazy(()=>import("emoji-picker-react"));

const LIMIT = 1000

export default function CaptionComponent ({captionStr, UName}) {
    const [caption, setCaption] = useState(captionStr || "");
    const [isEmoji, setEmoji] = useState(false);
    return(
        <div className="underTaker flex-col p-0!">
            <textarea onClick={()=>setEmoji(false)} name="caption" placeholder={`What's on your mind, ${UName.split(" ")[0]}?`} id="caption"
            className="w-full h-full text-sm p-2 rounded-lg text-white" value={caption} onChange={(evnt) => setCaption(evnt.target.value)}></textarea>

            <SmileEmoji onClick={()=>setEmoji(prev=>!prev)} className="absolute cursor-pointer bg-black/40  text-gray-500 text-xl left-2.5 bottom-2.5" />
            <AltMail  className="absolute cursor-pointer bg-black/40  text-gray-500 text-xl right-12 bottom-2.5 "/>
            <HashtagIcon  className="absolute cursor-pointer bg-black/40  text-gray-500 text-xl right-5 bottom-2.5 "/>

            <div className={`${caption.length > 1000 ? "text-red-500 font-bold" :" text-gray-500"} absolute bottom-10 text-sm right-1.5 bg-black hover:opacity-20`}>
                {caption.length}/{LIMIT}
            </div>
            {
                isEmoji && 
                <Suspense fallback={<div className="miniLoader"/>}>
                    <div id="emojiDiv" className="p-1 absolute left-0 top-2 w-23 ">
                        <EmojiPicker theme="dark" onEmojiClick={(emoji) => {
                            setCaption(prev=> prev + emoji.emoji)
                        }} lazyLoadEmojis skinTonePickerLocation="PREVIEW"
                        previewConfig={{showPreview:false}} />
                    </div>
                </Suspense>
            }
        </div>
    )
}