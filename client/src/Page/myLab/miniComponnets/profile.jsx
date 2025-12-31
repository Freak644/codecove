import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import { toast } from "react-toastify";
export default function MyProfile({validation}) {
    const [isAnim,setAnim] = useState(false);
    const [crntData,setData] = useState({});
    const {username} = useParams();

    const getData = async (username) => {
        try {
            let rqst = await fetch(`/myServer/readUser/getUserInfo?username=${username}`);
            let result = await rqst.json();
            console.log(result)
            if (result.err) throw new Error(result.err);
            setData(result.userInfo);
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(()=>{
        getData(username)
    },[username])

    return(
        <div className="underTaker">
           <div className="myLabProfileDiv h-full w-4/5 border  flex items-center justify-center gap-2.5 rounded-lg relative ">
                <div className="h-full w-full rounded-lg 
                flex items-center flex-col p-2.5 bg-linear-to-br
                from-blue-600/20 via-transparent to-transparent border border-cyan-500/20 
                hover:bg-size-[200%_200%]
                shadow-[0_0_10px_rgba(0,255,255,0.1)] backdrop-blur-md">
                    <div className="userNameImg flex items-center flex-col p-2.5 h-1/4 w-full border border-amber-300 relative text-skin-text">
                        <div className="flex items-center w-full flex-row">
                            <img src={`/myServer${crntData?.avatar}`} alt="DP" className="h-10 w-10 rounded-full" />
                            <p className="ml-1.5 font-bold text-lg">{crntData?.username}</p>
                        </div>
                        <p className="h-1/2 w-full border border-blue-600 flex items-center text-wrap
                        text-skin-ptext text-sm">
                            {crntData?.bio}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}