import { useState } from "react"
import { HashtagIcon, SmileEmoji } from "../../utils/SVG/TODOsvg";
import { AltMail } from "../../utils/SVG/menuSVG";

const LIMIT = 1000

export default function CaptionComponent ({captionStr, UName}) {
    const [caption, setCaption] = useState(captionStr || "");
    return(
        <div className="underTaker flex-col p-0!">
            <textarea name="caption" placeholder={`What's on your mind, ${UName.split(" ")[0]}?`} id="caption"
            className="w-full h-full text-sm p-2 rounded-lg text-white" value={caption} onChange={(evnt) => setCaption(evnt.target.value)}></textarea>

            <SmileEmoji className="absolute bg-black/40  text-gray-500 text-xl left-2.5 bottom-2.5" />
            <AltMail  className="absolute bg-black/40  text-gray-500 text-xl right-12 bottom-2.5 "/>
            <HashtagIcon  className="absolute bg-black/40  text-gray-500 text-xl right-5 bottom-2.5 "/>

            <div className={`${caption.length > 1000 ? "text-red-500 font-bold" :" text-gray-500"} absolute bottom-10 text-sm right-1.5 bg-black hover:opacity-20`}>
                {caption.length}/{LIMIT}
            </div>
        </div>
    )
}