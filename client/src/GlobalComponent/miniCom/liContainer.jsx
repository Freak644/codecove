import { Link } from "react-router-dom";

export default function MenuLICon ({crntLiInfo, crntTab}) {
    let {expPath, pTxt, svgCom:Icon,svgClass, isDot = false, count = null} = crntLiInfo;
    return(
        <li className={crntTab === expPath ? "activeLiContainer" : ""}>
            <Link to={`/${expPath}`}>
                <Icon className={svgClass ? svgClass : "svgAnim"} />
                <div className="menuTxtDiv">
                    <span>{expPath}</span>
                    <p>{pTxt}</p>
                </div>
                {isDot && <div className="dotdot"/>}
                {count !== null && <div className={`countDot ${expPath === "Notification" || expPath === "Mentions" ? "bg-green-500/70" : ""} ${expPath === "Mesages" ? "bg-indigo-600" : ""}`}>
                    {count}    
                </div>}
            </Link>
        </li>
    )
}