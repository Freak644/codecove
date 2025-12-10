import { useEffect, useRef, useState } from "react"
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import socket from "../../../utils/socket";

export default function TODOList({crntPost}) {
    const toggleRef = useRef(null);
    let {canCommen,canSave,totalLike, id,isLiked,post_id, images_url, username} = crntPost;
    const [countArray,setCounts] = useState({
        likeCount:null,
        commentCount:null,
        isCrntUserLike:false
    })
    const index = UnivuUserInfo(stat=>stat.index);
    const [isToggle,setToggle] = useState(false);

    useEffect(()=>{
        socket.emit("joinPost",post_id);

        const handleLike = ({post_id : pid,user_id,like})=>{
            if (pid === post_id) {
                setCounts(prev=>({
                    ...prev,
                    likeCount:like ? prev.likeCount + 1 : prev.likeCount - 1,
                    isCrntUserLike:like && user_id === id
                }))
            }
        };

        socket.on("newLike",handleLike);

        return () =>{
             socket.emit("leavePost",post_id);
             socket.off("newLike",handleLike);
        }
    },[post_id])

    function formatCount(num) {
        if(num === null || num === undefined) return;
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
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
        setCounts({...countArray,"likeCount":totalLike,"isCrntUserLike":isLiked})
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
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div className="crntTodo h-1/10 w-full flex items-center justify-around text-skin-ptext">
            <div name="" className="TodoInner">
                <i onClick={handleStar} className={`${countArray.isCrntUserLike ? "bx bxs-star" : "bx bx-star"}`}></i>
                <span>{formatCount(countArray.likeCount)}</span>
            </div>
            <div className="TodoInner">
                <i className="bx bx-comment"></i>
               
            </div>
            <div ref={toggleRef} className="TodoInner relative">
                <i className="bx bx-download" onClick={()=>{
                    images_url.length === 1 ? downloadAll() : setToggle(prev=>!prev);
                }}></i>
                {
                    isToggle &&<div className="flex items-center flex-col absolute bottom-1 z-50 p-2 border border-skin-ptext/30 bg-black/5 backdrop-blur-lg rounded-2xl"> 
                        <p onClick={()=>downloadAll(true)} className="border-b border-gray-500/50 p-2 text-nowrap">Only this one</p>
                        <p onClick={()=>downloadAll(false)} className="border-b border-gray-500/50 p-2 text-nowrap">Download All {images_url.length}</p>
                    </div>
                }
            </div>
            <div className="TodoInner">
                <i className="bx bx-bookmark"></i>
            </div>
            <div className="TodoInner perspective-distant">
                <i className="bx bxs-share transform-3d rotate-y-180"></i>
            </div>
        </div>
    )
}