import { AltMail, RightArrowL } from "../../../utils/SVG/menuSVG";

export default function MentionNoti ({crntData}) {

    return(
            <div className="customNotiContainer text-skin-text">
                <div className="NotiIcons">
                    {crntData.isRead && <div className="endictDot" />}
                    <div className={`svgHolderNI text-white ${crntData.isRead ? "bg-indigo-600" : "bg-red-500"}`}>
                        <AltMail className="text-lg" />
                    </div>
                </div>
                <div className="NotiTextdiv">
                    <p>{"Ethan Hunt"} Mentione you</p>
                    <p className="statusP text-blue-500 font-bold">"Getting Started with React Hoods"</p>
                    <p className="timeLine">3m ago</p>
                </div>
                <div className="imgOrGo h-7 rounded-full flex items-center justify-center bg-indigo-950
                hover:bg-gray-500 hover:text-black duration-200">
                    <RightArrowL />
                </div>
            </div>
    )
}