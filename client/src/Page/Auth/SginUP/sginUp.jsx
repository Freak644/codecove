import { useEffect, useState } from "react";
import UserNameEl from "./Nameuser";
import CpassEL from "./picPassEl";
import CompAnim from "../../../assets/animations/compAnimation";
import { toggleMini } from "../../../lib/tabToggle";
export default function SginUp({toggle}) {
    let {isMiniTab} = toggleMini();
    const [isCrtn,setTab] = useState(isMiniTab)
    useEffect(()=>{
        setTab(isMiniTab)
    },[isMiniTab])
    return(
        <div className="underTaker">
            <div className="baseSginComponent flex items-center justify-center p-2.5">
                <CompAnim key={
                    isCrtn.usernameCom ? "username" :
                    isCrtn.passDiv ? "passDiv" : "none"
                }>
                    {isCrtn.usernameCom && <UserNameEl/>}
                    {isCrtn.passDiv && <CpassEL/>}
                </CompAnim>
            </div>
        </div>
    )
}