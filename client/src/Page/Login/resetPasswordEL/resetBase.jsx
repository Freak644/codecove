import { useState } from "react"
import VerifyCon from "./verifyConEL"

export default function ResetBase() {
    const [tabTogle,setToggle] = useState({
        verifyCon:true,
        passCon:false
    })
    return(
        <div className="underTaker">
            <div className="baseContainerReset bg-skin-bg flex items-center flex-row h-3/5 w-3/5 ">
                <div className="leftSideReset h-full flex-1  flex items-center justify-center">
                    <img src="https://i.postimg.cc/L85RGFn2/temp-Gif.gif" className="h-full w-full rounded-full overflow-hidden mix-blend-screen" alt="" />
                    <div className="expend absolute">
                        <i className="bx bx-face text-purple-600 text-6xl"></i>
                    </div>
                    
                </div>
                <div className="rightSideReset h-full flex-1 ">
                    <VerifyCon toggle={setToggle}/>
                </div>
            </div>
        </div>
    )
}