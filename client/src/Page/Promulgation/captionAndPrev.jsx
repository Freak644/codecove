import { useEffect } from "react";
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import ImageSlider from "./sliderCom";

export default function Creater({Images,handler}) {
    let {userInfo} = UnivuUserInfo();
    useEffect(()=>{
        console.log(userInfo)
    },[])
    return(
        <div className="underTaker gap-6">
            <div className="flex p-1 relative h-[400px] w-[270px] items-center justify-center top-5">
                <div className="userInfo cursor-alias flex items-center justify-between gap-1.5 absolute -top-7 left-0 w-[270px]">
                    <div className="imgAvtar h-8 w-8 rounded-full border border-skin-text overflow-hidden">
                        <img className="h-full w-full object-cover" src={`/myServer/${userInfo.avatar}`} alt="Avtar" />
                    </div>
                    <span className="text-skin-text absolute left-9">{userInfo.username}</span>
                    <i className="text-skin-text text-2xl bx bx-dots-vertical-rounded"></i>
                </div>
                <ImageSlider imgArray={Images} setArray={handler} />
            </div>
            <div className="captionAndVisiblity">

            </div>
        </div>
    )
}