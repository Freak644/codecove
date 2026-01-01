import { useState } from "react";
import MyProfile from "./miniComponnets/profile";

export default function MainLapCom() {
    const [validation,setValidation] = useState({
        isUser:true,
        isAchievements:true,
        posts:true,
    });
    return(
        <div className="underTaker">
            <div className="myLab h-full w-full flex items-center flex-col">
                <div className="otherHalf h-full w-full flex items-center flex-row">
                    <div className="innerHalfLab">
                         <div className="profileDivD w-full h-2/3">
                            <MyProfile validation={setValidation}/>
                         </div>
                    </div>
                    <div className="innerHalfLab">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}