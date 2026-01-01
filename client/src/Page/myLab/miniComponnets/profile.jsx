import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import { toast } from "react-toastify";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import {Loader} from '../../../lib/loader'
import { use } from "react";
export default function MyProfile({validation}) {
    const [isEditing,setEdit] = useState(false);
    const [crntData,setData] = useState({});
    const [bio,setBio] = useState("");
    const {username} = useParams();
    let {toggleLoader} = Loader()
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);

    const getData = async (username) => {
        try {
            let rqst = await fetch(`/myServer/readUser/getUserInfo?username=${username}`);
            let result = await rqst.json();
            console.log(result)
            if (result.err) throw new Error(result.err);
            setData(result.userInfo);
            setBio(result.userInfo.bio);
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(()=>{
        getData(username)
    },[username]);


    function formatCount(num) {
        if(num === null || num === undefined) return;
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
    }

    const submitBio = async () => {
        if (!isEditing) return;
        toggleLoader(true)
        try {
            if (bio.length > 50) throw new Error("Bio.len will not be > 50");
            
            let rqst = await fetch("/myServer/writeUser/changeBio",{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({bio,user_id:crntData.id})
            })            
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            toast.success(result.pass);
        } catch (error) {
            toast.error(error.message)
        } finally{
            toggleLoader(false)
        }
    }

    return(
        <div className="underTaker">
           <div className="myLabProfileDiv h-full w-4/5 border  flex items-center justify-center gap-2.5 rounded-lg relative ">
                <div className="h-full w-110 rounded-lg 
                flex items-center flex-col p-2.5 bg-linear-to-br
                from-blue-600/20 via-transparent to-transparent border border-cyan-500/20 
                hover:bg-size-[200%_200%]
                shadow-[0_0_10px_rgba(0,255,255,0.1)] backdrop-blur-md">
                    <div className="userNameImg flex items-center flex-col p-2.5 h-1/4 w-full border border-amber-300 relative text-skin-text">
                        <div className="flex items-center w-full flex-row">
                            <img src={`/myServer${crntData?.avatar}`} alt="DP" className="h-10 w-10 rounded-full" />
                            <p className="ml-1.5 font-bold text-lg">{crntData?.username}</p>
                            <span className="ml-[20%] font-bold">Follower {formatCount(crntData?.follower_count)}</span><span className="ml-[10%] font-bold">Following {formatCount(crntData?.following_count)}</span>
                        </div>
                        <p className="h-1/2 w-full flex items-center text-wrap
                        text-skin-ptext text-sm">
                            {isEditing ? <textarea name="" value={bio} onChange={(evnt)=>setBio(evnt.target.value)} className="resize-none pl-1.5 text-lg h-10 w-full text-skin-text" id="BioCap"></textarea> : crntData?.bio} {crntData?.id === uID && <i onClick={()=>{setEdit(prev=>!prev),submitBio()}} className={`ml-2 bx ${isEditing ? "bxs-save" : "bxs-edit-alt"} cursor-pointer`}></i>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}