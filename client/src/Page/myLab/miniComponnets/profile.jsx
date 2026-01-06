import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import { toast } from "react-toastify";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import {Loader} from '../../../lib/loader'
import MainAchievments from "./abElement";
import socket from "../../../utils/socket";
import { mngCrop } from "../../../lib/toggleTheme";
export default function MyProfile({validation}) {
    const [isEditing,setEdit] = useState(false);
    const [crntData,setData] = useState({});
    const [tempBio,setBio] = useState("");
    const {finalIMG,setURL} = mngCrop();
    const {username} = useParams();
    let {toggleLoader} = Loader();
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);

    const handelImg = evnt=>{
        let myFIle = evnt.target.files[0];
        if (!myFIle) return;

        if (myFIle.size > 3 * 1024 * 1024) {
            toast.warning("File size will not be > 3MB")
            return;
        }
        setURL(URL.createObjectURL(myFIle))
        evnt.target.value = null;
    }

    const handelDP = async (img) => {
        if (!img) return;
        toggleLoader(true);
        try {
            let formData = new FormData();
            formData.append("avatar",img);
            let rqst = await fetch("/myServer/writeUser/changeDP",{
                method:"PUT",
                body:formData
            });
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            toast.success(result.pass)
        } catch (error) {
            toast.info(error.message)
        } finally {
            toggleLoader(false)
        }
    }

    useEffect(()=>{
        if (finalIMG) {
            handelDP(finalIMG);
        }
    },[finalIMG])

    useEffect(()=>{
        let {id:user_id} = crntData;
        
        socket.emit("joinProfile",user_id);
        
        let handleChangeBio = (data)=>{
            if (user_id !== data.user_id) return;
            setData(prev=>({
                ...prev,
                bio:data.newBio
            }))
        }

        socket.on("bioChanged",handleChangeBio);

        return ()=>{
            socket.emit("leaveProfile",user_id);
            socket.off("bioChanged",handleChangeBio);
        }
    },[crntData])

    const getData = async (username) => {
        try {
            let rqst = await fetch(`/myServer/readUser/getUserInfo?username=${username}`);
            let result = await rqst.json();
            if (result.err) throw new Error(result.err);
            setData(result.userInfo);
            setBio(result.userInfo.bio);
        } catch (error) {
            validation(prev=>({
                ...prev,
                isUser:false,
            }))
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
            if (tempBio.length > 100) throw new Error("Bio.len will not be > 50");
            
            let rqst = await fetch("/myServer/writeUser/changeBio",{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({bio:tempBio,user_id:crntData.id})
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

    const followUser = async () => {
        toggleLoader(true);
        try {
            let rqv = await fetch("/myServer/writeUser/follow",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({user_id:crntData.id})
            })
            let result = await rqv.json();
            if (result.err) {
                throw new Error(result.err);
                
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            toggleLoader(false)
        }
    }
    return(
        <div className="underTaker">
           <div className="myLabProfileDiv h-full w-[440px] border  flex items-center justify-center gap-2.5 rounded-lg relative ">
                <div className="h-full w-full rounded-lg 
                flex items-start flex-col p-2.5 bg-linear-to-br
                from-blue-600/20 via-transparent to-transparent border border-cyan-500/20 
                hover:bg-size-[200%_200%] gap-2.5 relative
                shadow-[0_0_10px_rgba(0,255,255,0.1)] backdrop-blur-md">
                    <div className="userNameImg flex items-center flex-col p-2.5 h-1/6 w-full relative text-skin-text gap-2.5">
                        <div className="flex items-center w-full flex-row gap-2.5 relative">
                            <img src={`/myServer${crntData?.avatar}`} alt="DP" className="h-15 w-15 rounded-full" />
                            <input type="file" className="hidden" onChange={(evnt)=>handelImg(evnt)} name="DP" id="DP"/>
                            {isEditing && <label htmlFor="DP" className="absolute" ><i className="bx bx-edit text-2xl text-white bg-gray-500/10 backdrop-blur-sm cursor-pointer p-2.5 rounded-full"></i></label>}
                            <p className="ml-1.5 font-bold text-lg">{crntData?.username}</p>
                            <span className="ml-15 font-bold">Follower {formatCount(crntData?.follower_count)}</span><span className=" font-bold">Following {formatCount(crntData?.following_count)}</span>
                        </div>
                    </div>

                    <p className="h-auto w-3/5 flex items-start  text-wrap
                        text-skin-ptext text-md p-2">
                            {isEditing ? <textarea name="" value={tempBio} onChange={(evnt)=>setBio(evnt.target.value)} className="resize-none my-scroll pl-1.5 text-lg h-30 w-full text-skin-text" id="BioCap"></textarea> : crntData?.bio}
                            {isEditing && <i onClick={()=>{setEdit(prev=>!prev),submitBio()}} className={`ml-2 bx bxs-save cursor-pointer`}></i>}
                    </p>
                    {isEditing && <i onClick={()=>setEdit(false)} className="bx bx-x cursor-pointer ml-2 text-2xl text-skin-text"></i>}

                    <div className="followFollowing h-1/12 w-3/5 flex items-center flex-row gap-4 relative">
                        {crntData?.id !== uID  && <><i className='bx bxs-info-circle text-2xl activaterIcon cursor-help  text-gray-600'></i>
                        <p id="elementEl" className="backdrop-blur-lg bg-blue-900/40 font-bold">Stranger's ?</p></> }
                        {crntData?.id === uID ? < button onClick={()=>setEdit(true)} className="cursor-pointer hover:text-blue-500 w-full  outline-2 outline-gray-600/50 rounded-lg border-none hover:outline-blue-600/20 text-skin-text p-1.5">Edit Profile</button> : 
                        <button onClick={followUser} className="cursor-pointer hover:text-blue-500 hover:bg-white-700/5 outline-none border-none bg-blue-700/90 pl-2 pr-2 rounded-lg text-skin-text p-1.5">Follow</button>}
                        {crntData?.id !== uID &&  <button className="cursor-pointer hover:text-blue-500  outline-2 outline-gray-600/50 rounded-lg border-none text-skin-text p-1.5">Connect <i className="bx bxs-inbox"></i></button>}
                    </div>
                    <div className="mainAchiveHolder w-2/5 h-4/13 absolute top-1/5 right-0">
                        <MainAchievments/>
                    </div>
                </div>
            </div>
        </div>
    )
}