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
            border shadow-lg text-skin-text">
                <div className="innerCaption">
                    <h2>Privacy Panel</h2>
                    <div className="optionDiv">
                        <div className="SecDiv">
                            <strong>Post Visibility : </strong>
                            <select name="" id="Visibility">
                                <option value={true}>Public</option>
                                <option value={false}>Privat</option>
                            </select>
                        </div>
                        <div className="SecDiv">
                            <strong>Comment Setting : </strong>
                            <select name="" id="Comment">
                                <option value={true}>ON</option>
                                <option value={false}>OFF</option>
                            </select>
                        </div>
                        <div className="SecDiv">
                            <strong>Show Like Count : </strong>
                            <select name="" id="Like">
                                <option value={true}>ON</option>
                                <option value={false}>OFF</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="innerCaption">

                </div>
            </div>
        </div>
    )
}