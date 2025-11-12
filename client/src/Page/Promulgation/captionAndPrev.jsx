import { useEffect } from "react";
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import ImageSlider from "./sliderCom";

export default function Creater({Images,handler}) {
    let {userInfo} = UnivuUserInfo();
    useEffect(()=>{
        console.log(userInfo)
    },[])
    return(
        <div className="underTaker justify-center gap-2.5">
            <div className="flex p-1 relative h-[450px] w-[320px] items-center justify-center shrink-0">
                <div className="userInfo z-10 cursor-alias flex items-center gap-1.5 absolute top-0 left-2 w-full">
                    <div className="imgAvtar h-8 w-8 rounded-full border border-skin-text overflow-hidden">
                        <img className="h-full w-full object-cover" src={`/myServer/${userInfo.avatar}`} alt="Avtar" />
                    </div>
                    <span className="text-skin-text">{userInfo.username}</span>
                </div>
                <ImageSlider imgArray={Images} setArray={handler} />
            </div>
            <div className="captionAndVisiblity flex items-center flex-col md:flex-row w-full px-2
            border shadow-lg">
                <div className="innerCaption">

                </div>
                <div className="innerCaption"></div>
            </div>
        </div>
    )
}