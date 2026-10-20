import { useState } from "react";
import { Content } from "../../utils/SVG/menuSVG";
import { CodeBlock, DangerHIcon, ImageIcon, LinkIcon, PenCileIcon, PollIcon } from "../../utils/SVG/TODOsvg";

export default function ContentAdder () {

    return(
        <div className="h-6/10 rounded-lg gap-2 border border-gray-800 bg-violet-950/5 p-2.5! w-full flex items-center flex-col!">
            <div className="h-2/10 w-full">
                <p className="porUserInfo p-2.4 h-1/2 w-full flex items-start flex-row text-skin-text font-bold gap-2.5">
                    <Content className="text-green-500"/> Add Content
                </p>
                <p className="p-2.4 h-1/2 w-full flex items-start flex-row text-skin-ptext/80 text-sm font-light gap-2.5">
                    Add images,  code snippets,  links or a combination.
                </p>
            </div>
            <div className="h-4/10 w-full adderBoxContainer">
                <div className="adderBox HoverMe">
                    <div><ImageIcon className="imgIcon"/> Image</div>
                    <p>Upload or drag and drop</p>
                </div>
                <div className="adderBox HoverMe">
                    <div className="codeIconw"><CodeBlock  className="codeIcons"/> <p>Code</p></div>
                    <p>Add code snippet with highlight</p>
                </div>
                <div className="adderBox HoverMe">
                    <div className="LikeIcon"><LinkIcon /> <p>Link</p></div>
                    <p>Share external resource</p>
                </div>
                <div className="adderBox HoverMe">
                    <div className="pollIcon"><PollIcon /> <p>Poll</p></div>
                    <p>Ask community opinion</p>
                </div>
            </div>

            <div className="imgMGmtContainer flex items-center flex-col h-4/10 w-full border my-scroll border-gray-900 rounded-lg">
                <div className="attachmentHolder relative h-18 w-full flex items-center justify-between">
                    <div className="imgInfoPrev">
                        <img src="https://i.postimg.cc/bNSNbS5G/kiara-Anime.jpg" alt="" />
                        <p>fileName</p>
                    </div>
                    <div className="imgEditorB">
                        <button><PenCileIcon/></button>
                        <button><DangerHIcon/></button>
                    </div>

                    <div className="abLdiv absolute w-2/10  border border-gray-800/70 bottom-0 left-4/10"/>
                </div>
                <div className="attachmentHolder relative h-18 w-full flex items-center justify-between">
                    <div className="imgInfoPrev">
                        <img src="https://i.postimg.cc/bNSNbS5G/kiara-Anime.jpg" alt="" />
                        <p>fileName</p>
                    </div>
                    <div className="imgEditorB">
                        <button><PenCileIcon/></button>
                        <button><DangerHIcon/></button>
                    </div>

                    <div className="abLdiv absolute w-2/10  border border-gray-800/70 bottom-0 left-4/10"/>
                </div>
            </div>
        </div>
    )
}