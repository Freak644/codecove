import { FileOL } from "../../../utils/SVG/menuSVG";

export default function LikesNoti ({crntData}) {

    return(
        <div className="customNotiContainer text-skin-text">
            <div className="NotiIcons">
                {!crntData.isRead && <div className="endictDot" />}
                <div className={`svgHolderNI text-white ${crntData.isRead ? "bg-orange-600" : "bg-indigo-600"}`}>
                    <FileOL className="" />
                </div>
            </div>
            <div className="NotiTextdiv">
                <p>Your Post: <span>"Getting stated with React Hooks"</span></p>
                <p className="statusP">received <span>24 new likes</span></p>
                <p className="timeLine">13m ago</p>
            </div>
            <div className="imgOrGo">
                <img src="https://res.cloudinary.com/dcve50avm/image/upload/v1768317977/loser_3221/tgcttwifosjbhsg3tj2e.jpg" alt="" />
            </div>
        </div>
    )
}

