import { FileOL } from "../../../utils/SVG/menuSVG";

export default function LikesNoti ({crntData}) {

    return(
        <div className="customNotiContainer text-white">
            <div className="NotiIcons">
                <div className="endictDot" />
                <div className="svgHolderNI bg-indigo-600">
                    <FileOL customStyle="" />
                </div>
            </div>
            <div className="NotiTextdiv">
                <p>Your Post: <span>"Getting stated with React Hooks"</span></p>
                <p className="statusP">received <span>24 new likes</span></p>
            </div>
            <div className="imgOrGo">
                <img src="https://res.cloudinary.com/dcve50avm/image/upload/v1768317977/loser_3221/tgcttwifosjbhsg3tj2e.jpg" alt="" />
            </div>
        </div>
    )
}

