import { useEffect, useRef, useState } from "react"
import { MenuIcon } from "../../utils/SVG/SVG";
import { CheckN, CodeBlock, ImageIcon } from "../../utils/SVG/TODOsvg";
import { DeleteForever, DownArrow, SendSvg } from "../../utils/SVG/menuSVG";


export default function Promulgation () {
    const [isClicked, setClicked] = useState(false);
    const [onButton,setButton] = useState("Post");
    const buttonRef = useRef(null);
    useEffect(()=> {
        const HandleClick =  (evnt) => {
            const postButton = buttonRef.current;
            
        }
    },[]);

    return(
        <div className="underTaker flex-row!">
            <div className="leftSideContDiv">
                <CodeBlock/> <MenuIcon/> <ImageIcon/>
            </div>
            <div className="rightSideContDiv justify-end! text-skin-text">
                <p className="saveSpan text-sm flex items-center justify-center text-green-600"><CheckN/> Drafted Locally</p>
                <DeleteForever className="cursor-pointer"/>
                <div className="postButton">
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