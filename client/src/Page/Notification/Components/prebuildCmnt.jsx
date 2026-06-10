import { CommentSvg, RightArrowL } from "../../../utils/SVG/menuSVG";

export default function CommentNoti ({crntData}) {

    return(
            <div className="customNotiContainer text-skin-text">
                <div className="NotiIcons">
                    <div className="endictDot" />
                    <div className="svgHolderNI bg-green-600">
                        <CommentSvg customStyle="text-lg" />
                    </div>
                </div>
                <div className="NotiTextdiv">
                    <p>{"Ethan Hunt"} Commented on your post</p>
                    <p className="statusP text-blue-500 font-bold">"Getting Started with React Hoods"</p>
                </div>
                <div className="imgOrGo h-7 rounded-full flex items-center justify-center bg-indigo-950
                hover:bg-gray-500 hover:text-black duration-200">
                    <RightArrowL />
                </div>
            </div>
    )
}