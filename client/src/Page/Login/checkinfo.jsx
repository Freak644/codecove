import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import '../../assets/style/Error404.css'
import ChangePassword from "./changePassword";
import { toast } from "react-toastify";
import LogoCom from "../../utils/logoComp";
export default function CheckInfo(params) {
    let {token} = useParams();
    const [isChanging,setchanging] = useState(false)
    const [userInfo,setInfo] = useState({})
    const navi = useNavigate();
    const getSessionInfo = async () => {
        try {
            let rqst = await fetch(`/myServer/checkActive?token=${token}`)
            let result = await rqst.json();
            if (result.err) {
                console.log(result.err)
                throw new Error(result.details);
            }
            setInfo(result.data);
        } catch (error) {
            toast.error(error.message);
            navi('/')
        }
    }

    useEffect(()=>{
        getSessionInfo()
    },[token])
    return(
        <div className="h-screen w-screen flex items-center flex-col bg-skin-bg absolute top-0 z-40">
           {isChanging && <ChangePassword toggle={setchanging} />}
            <LogoCom/>
            <div className="flex items-center flex-col gap-2 text-white">
                <div className="container relative flex items-center md:justify-center gap-5 h-screen p-4">
                    <div
                        className="h-70 w-[450px] rounded-2xl 
                        flex items-center justify-center gap-10 p-6 relative"
                        >
                        <div className="eyesHere bg-white rounded-full shadow-inner shadow-gray-700">
                            <div className="pupil-outer">
                            <div className="pupil"></div>
                            </div>
                        </div>
                        <div className="eyesHere bg-white rounded-full shadow-inner shadow-gray-700">
                            <div className="pupil-outer">
                            <div className="pupil"></div>
                            </div>
                        </div>

                        <h1 className="font-extrabold bottom-0 absolute text-4xl text-white tracking-wider drop-shadow-[0_2px_6px_rgba(0,255,255,0.6)]">
                            New Login Detected
                        </h1>
                    </div>
                    <div className="userInfoher p-2 w-[450px] rounded-2xl relative top-6
                        flex items-center flex-col gap-10
                        bg-linear-to-br from-white/10 via-white/5 to-transparent
                        border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.15)]
                        backdrop-blur-md">
                            <img src={`/myServer/${userInfo.avatar}`} className="h-14 w-14 rounded-full border border-amber-200" alt="" />
                            <p className="big404">Hello 👋 {userInfo.username}</p>
                        <div className="flex items-center flex-col gap-3">
                            <p><strong className="text-skin-ptext">Device:</strong>{userInfo.os +"," + userInfo.browser}</p>
                            <p><strong className="text-skin-ptext">IP:</strong>{userInfo.ip + ", & The isp is:"+ userInfo.isp}</p>
                            <p><strong className="text-skin-ptext">Location:</strong>{`${userInfo.city} ,${userInfo.region} ,${userInfo.country}`}</p>
                            <p><strong className="text-skin-ptext">Login Time:</strong>{userInfo.time}</p>
                        </div>
                        <button disabled={Object.keys(userInfo).length !== 11 } onClick={()=>setchanging(prev=>!prev)} className="mt-4 bg-linear-to-br from-cyan-500 to-blue-600 via-pink-400 hover:from-cyan-400 hover:to-blue-500 hover:via-yellow-300
            text-white font-semibold py-2 px-6 rounded-lg shadow-md
            transition-all duration-300 cursor-pointer">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}