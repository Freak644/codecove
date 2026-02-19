import {useEffect, useRef, useState } from "react"
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo";
import {Link, useLocation} from 'react-router-dom';
import socket from "../../../utils/socket";
import star from "../../../assets/Sounds/star.mp3";
import {toast} from 'react-toastify';
import axios from 'axios';
export default function TODOList({crntPost_id}) {
    const toggleRef = useRef(null);
    const [crntPost,setCrntPost] = useState({})
    let {setUnivPost} = univPostStore();
    const postData = univPostStore(stat=>stat.postsById[crntPost_id]);
    const crntLocation = useLocation();
    let {canSave, isFollowing,totalComment,totalLike,isLiked,post_id,totalSave,likeCount,images_url, username,canComment} = crntPost;
    const index = UnivuUserInfo(stat=>stat.index);
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    const [isToggle,setToggle] = useState(false);
    const starMp3 = new Audio(star);
    




    useEffect(()=>{
        if (Object.keys(postData || {}).length === 0) return;
        setCrntPost(postData)
    },[postData])


    useEffect(()=>{
        let {post_id,totalComment,totalLike} = crntPost;
        socket.emit("joinPost",post_id);
        const handleLike = ({post_id : pid,user_id,like})=>{
            if (pid === post_id) {
                setUnivPost({
                    [post_id]:{
                        totalLike:like ? totalLike + 1 : totalLike - 1,
                        
                        ...(user_id === uID && {
                            isLiked:like
                        })
                    }
                })
            }
        };

        const handleComment = ({post_id : pid})=>{
            if (pid === post_id) {
                setUnivPost({
                    [post_id]:{
                        totalComment:totalComment + 1
                    }
                })
            }
        };

        const handleDeleteComment = ({post_id :pid}) => {
            if (pid === post_id) {
                setUnivPost({
                    [post_id]:{
                        totalComment:totalComment - 1
                    }
                })
            }
        }

        socket.on("newLike",handleLike);
        socket.on("newComment",handleComment);
        socket.on("deleteComment",handleDeleteComment);

        return () =>{
             socket.emit("leavePost",post_id);
             socket.off("newLike",handleLike);
             socket.off("newComment",handleComment);
             socket.off("deleteComment",handleDeleteComment);
        }
    },[crntPost]);

    function formatCount(value) {
        if (value == null || isNaN(value)) return "0";

        const abs = Math.abs(value);

        const units = [
            { limit: 1e9, suffix: "B" },
            { limit: 1e6, suffix: "M" },
            { limit: 1e3, suffix: "K" }
        ];

        for (const { limit, suffix } of units) {
            if (abs >= limit) {
            const formatted = (value / limit)
                .toFixed(1)
                .replace(/\.0$/, "");
            return formatted + suffix;
            }
        }

        return value.toString();
    }

    const downloadAll = async (choice) => {
        setToggle(false)
        if (choice) {
            try {
                let rkv = await fetch(images_url[index]);
                let blog = await rkv.blob();

                let link = document.createElement("a");
                link.href = URL.createObjectURL(blog);
                link.download = `ImageFrom-${username}_${Date.now()}.jpg`;
                link.click();

                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.log("Download Failed",error);
            } 
        } else {
            for (let i = 0; i < images_url.length; i++) {
                let url = images_url[i];
    
                try{
                    let rkv = await fetch(url);
                    let blog = await rkv.blob();
                    
                    let link = document.createElement("a");
                    link.href = URL.createObjectURL(blog);
                    link.download = `ImageFrom-${username}.${i}_${Date.now()}.jpg`;
                    link.click();
    
                    URL.revokeObjectURL(link.href);
                } catch (error) {
                    console.log("Download Failed", error);
                }
            }
        }
    }

    useEffect(()=>{
        const handleClick = evnt=>{
            const el = toggleRef.current;
            if (el && !el.contains(evnt.target)) {
                setToggle(false)
            }
        }

        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click", handleClick);
    },[])

    const handleStar = async () => {
        try {
            let rqst = await fetch("/myServer/writePost/addStar",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({post_id})
            })
            let result = await rqst.json();
            console.log(result)
            if (result.pass === true) {
                starMp3.play();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleShare = async (post_id) => {
        let url = location.href+"post/"+post_id
        const shareData = {
            title: "CodeCove",
            text: "Check this post on CodeCove!",
            url
        };

        
        if (navigator.share) {
            try {
           
            if (navigator.canShare && !navigator.canShare(shareData)) {
                throw new Error("Cannot share this data");
            }

            await navigator.share(shareData);
            console.log("Shared successfully");
            } catch (error) {
            console.log("Share cancelled or failed:", error.message);
            }
        } else {
            showCustomShareModal(shareData.url);
        }
    }

    function showCustomShareModal(url) {
        const encodedURL = encodeURIComponent(url);
        const text = encodeURIComponent("Check this post on CodeCove!");

        window.open(
            `https://wa.me/?text=${text}%20${encodedURL}`,
            "_blank"
        );
    }

    const handleSave = async (pst_id,save,follow) =>{
        try {
          if (!save) throw new Error("Saving turned off by user");
          if (save !== "Everyone" && !follow) throw new Error("Saving is available only for follower");
          if (pst_id.length !== 21) throw new Error("Post id is not valid");
          
          let requestData = await axios.post("/myServer/writePost/savePost",
            {pst_id}
          )
          console.log(requestData)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return(
        <div className="crntTodo h-1/10 w-full flex items-center justify-around text-skin-ptext">
            <div name="" className="TodoInner">
                <i onClick={handleStar} className={`${isLiked ? "bx bxs-star stared" : "bx bx-star"} starAnim`}></i>
                <span>{likeCount ? formatCount(totalLike) : ""}</span>
            </div>
            <div className={`TodoInner ${canComment ? "" : "cursor-none pointer-events-none"}`}> <Link className="flex items-center justify-center gap-1" to={`/post/${post_id}`}
                state={{background:crntLocation}}
            >
                <i className={`bx bx-comment`}></i>
                    <span>{(canComment && likeCount) ? formatCount(totalComment) : ""}</span>
                </Link>
            </div>
            <div ref={toggleRef} className="TodoInner relative">
                <i className="bx bx-download" onClick={()=>{
                    images_url.length === 1 ? downloadAll() : setToggle(prev=>!prev);
                }}></i>
                {
                    isToggle && <div className="flex items-center flex-col absolute bottom-1 z-50 p-2 border border-skin-ptext/30 bg-black/5 backdrop-blur-lg rounded-2xl"> 
                        <p onClick={()=>downloadAll(true)} className="border-b border-gray-500/50 p-2 text-nowrap">Only this one</p>
                        <p onClick={()=>downloadAll(false)} className="border-b border-gray-500/50 p-2 text-nowrap">Download All {images_url.length}</p>
                    </div>
                }
            </div>
            <div className={`TodoInner ${!canSave && "pointer-events-none"}`} onClick={()=>handleSave(post_id,canSave,isFollowing)} >
                <i className="bx bx-bookmark"></i>
                <span>{likeCount ? formatCount(totalSave) : ""}</span>
            </div>
            <div className="TodoInner perspective-distant" onClick={()=>handleShare(post_id)}>
                <i className="bx bxs-share transform-3d rotate-y-180"></i>
            </div>
        </div>
    )
}