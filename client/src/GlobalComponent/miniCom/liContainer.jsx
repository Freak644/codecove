import { Link } from "react-router-dom";

export default function MenuLICon ({crntLiInfo, crntTab}) {
    let {expPath, pTxt, svgCom:Icon,svgClass} = crntLiInfo;
    return(
        <li className={crntTab === expPath ? "activeLiContainer" : ""}>
            <Link to={`/${expPath}`}>
                <Icon className={svgClass ? svgClass : "svgAnim"} />
                <div className="menuTxtDiv">
                    <span>{expPath}</span>
                    <p>{pTxt}</p>
                </div>
            </Link>
        </li>
    )
}