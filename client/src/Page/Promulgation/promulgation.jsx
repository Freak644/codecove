import { useEffect, useRef, useState } from "react"
import { MenuIcon } from "../../utils/SVG/SVG";
import { CheckN, CodeBlock, ImageIcon } from "../../utils/SVG/TODOsvg";
import { DeleteForever, DownArrow, SendSvg } from "../../utils/SVG/menuSVG";
import { usePostStore } from "../../lib/basicUserinfo";


export default function Promulgation () {
    const [isClicked, setClicked] = useState(false);
    const [onButton,setButton] = useState("Post");
    const [progress, setProgress] = useState(0);
    const buttonRef = useRef(null);
    
    const postOBJ = usePostStore(stat => stat.postOBJ) || {};

    const createPost = async (evnt) => {
        
    }

    return(
        <div className="underTaker flex-row!">
            <div className="leftSideContDiv">
                <CodeBlock/> <MenuIcon/> <ImageIcon/>
            </div>
            <div className="rightSideContDiv justify-end! text-skin-text">
                <p className="saveSpan text-sm flex items-center justify-center text-green-600"><CheckN/> Drafted</p>
                <DeleteForever className="cursor-pointer"/>
                <div className="postButton bg-violet-800/70">
                    <button className="mainButton">
                        <SendSvg/> {onButton}
                    </button>
                    <div className="downArrow">
                        <span>|</span>
                        <DownArrow/>
                        <ul className="expenderDiv">
                            <li>Post</li>
                            <li>Project</li>
                            <li>Article</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}