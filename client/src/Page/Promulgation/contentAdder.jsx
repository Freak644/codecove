import { useState } from "react";
import { Content } from "../../utils/SVG/menuSVG";

export default function ContentAdder () {

    const [isCursorIn, setCursorIn] = useState(false);

    return(
        <div className="h-6/10 rounded-lg border border-gray-800 bg-violet-950/5 p-2.5! w-full flex items-center flex-col!">
            <div className="h-2/10 w-full">
                <p className="porUserInfo p-2.4 h-1/2 w-full flex items-start flex-row text-skin-text font-bold gap-2.5">
                    <Content className="text-green-500"/> Add Content
                </p>
                <p className="p-2.4 h-1/2 w-full flex items-start flex-row text-skin-ptext/80 text-sm font-light gap-2.5">
                    Add images,  code snippets,  links or a combination.
                </p>
            </div>
            <div className="h-4/10 border w-full adderBoxContainer">
                <div className="adderBox">
                    <p></p>
                </div>
                <div className="adderBox">
                    <p></p>
                </div>
                <div className="adderBox">
                    <p></p>
                </div>
                <div className="adderBox">
                    <p></p>
                </div>
            </div>
        </div>
    )
}