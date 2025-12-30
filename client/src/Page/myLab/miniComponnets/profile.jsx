import { useEffect, useState } from "react";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";

export default function MyProfile() {
    const [isAnim,setAnim] = useState(false)
    const myData = UnivuUserInfo(stat=>stat.userInfo);
    useEffect(()=>{
        console.log(myData);
    },[])

    return(
        <div className="underTaker">
            <div className="myLabProfileDiv h-full w-auto flex items-center flex-col gap-2.5">
                <img src={`/myServer${myData?.avatar}`} className="border border-skin-ptext/50 p-1 h-15 w-15 rounded-full" alt="" />
                <p className="text-skin-text font-medium text-lg">{myData?.username}</p>

                <i className={`bx bx-cog font-thin absolute right-5 top-1.5 text-skin-text text-2xl cursor-pointer hover:scale-95 transition-all duration-700 ${isAnim && "rotate180deg"}`} onClick={()=>setAnim(prev=>!prev)}></i>
            </div>
        </div>
    )
}