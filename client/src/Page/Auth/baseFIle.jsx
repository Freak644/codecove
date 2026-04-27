import { use,lazy, Suspense, useEffect, useState } from "react"
import FaceToggle from "../../lib/tabToggle";
import verifyZu from "../../lib/verifyZu";
const SginUp = lazy(() => import("./SginUP/sginUp"));
const VerifyEl = lazy(() => import("./SginUP/verifyEmail"));
const LoginCon = lazy(() => import("./loginEl"));
const ForgotEl = lazy(() => import("./forgotPass"));
import banner from '../../assets/Banner/NewImage.webp'
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
export default function LoginEL() {
    let [searchParams] = useSearchParams();
    const [err] = useState(decodeURIComponent(searchParams.get("err")))
    const {currentTab,setTab} = FaceToggle();
    let [face,setFace] = useState(currentTab);
    const {verifyTab} = verifyZu();
    const [isVerifying,setVStatus] = useState(verifyTab);
    useEffect(()=>{
        if (err.length > 5) {
            toast.warning(err)
        }
    },[err])

    useEffect(()=>{
        setVStatus(verifyTab);
    },[verifyTab])
    useEffect(()=>{
        setFace(currentTab)
    },[currentTab])
    let getRotation = ()=>{
          switch (face) {
            case "front": return "show-front rotate-y-0";
            case "right": return "show-right -rotate-y-90";
            case "back": return "show-back -rotate-y-180";
            case "left": return "show-left rotate-y-90";
            default: return "show-front rotate-y-0";
         }
    }
    return(
        <div className="underTaker font-bold no-copy">

            {isVerifying && <div className="baseverifyDiv flex items-center justify-center">
                <Suspense fallback={null}>
                    <VerifyEl/>
                </Suspense>
            </div>}
            <div className="login my-scroll h-full w-full flex flex-col items-center text-skin-text">
                <div className="loginbase p-1 md:p-4 h-full w-full flex items-center flex-row">
                    <div className="leftside h-full lg:flex-1 flex items-center flex-col w-full
                    ">
                        <img src={banner} alt="bannerImage" className="z-0 absolute top-20 h-2/3 w-3/5!" />
                        <div className="text-div flex items-start flex-col relative top-4/5 
                        text-2xl font-bold
                        "><span className="text-red-500">Stay</span>
                            <p> Safe, Stay Anonymous</p>
                            <p> Curious, Keep Building</p>
                            <p> Connected, Without Labels</p>
                            <p> Inspired, Share Your Code</p>
                            <p> Ahead, Follow the Revolution</p>
                            <p> Bold, Break the Silence</p>
                            <p> Sharp, Learn Everyday</p>
                            <p> True, No Filters</p>
                            <p> Free, Express Without Fear</p>
                            <p> Hidden, Yet Heard</p>   
                                
                        </div>
                    </div>
                    <div className="rightside h-full flex-1 p-1 flex justify-center items-center z-20">
                        <div className="container p-4 h-130 w-125  flex items-center justify-center">
                            <div className="senceDiv h-full w-full perspective-distant flex items-center justify-center">
                                <div className={`cube relative transform-3d transition-all duration-1000 flex items-center justify-center ${getRotation()}`}>
                                    <div className="face front">
                                            <Suspense fallback={null}>
                                                <LoginCon />
                                            </Suspense>
                                        </div>

                                        <div className="face right">
                                            <Suspense fallback={null}>
                                                <SginUp toggle={setFace} />
                                            </Suspense>
                                        </div>

                                        <div className="face left">
                                            <Suspense fallback={null}>
                                                <ForgotEl />
                                            </Suspense>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}