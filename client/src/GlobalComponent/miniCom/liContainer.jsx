import { Link } from "react-router-dom";

export default function MenuLICon ({crntLiInfo, crntTab}) {
    let {expPath, pTxt, svgCom} = crntLiInfo;
    return(
        <li className={crntTab === expPath ? "activeLiContainer" : ""}>
            <Link to={`/${expPath}`}>
                {svgCom}
                <div className="menuTxtDiv">
                    <span>{expPath}</span>
                    <p>{pTxt}</p>
                </div>
            </Link>
        </li>
    )
}