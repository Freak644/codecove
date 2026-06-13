import { useEffect } from "react";
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo"
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "../../../lib/loader";
import { ReportIcon } from "../../../utils/SVG/SVG";


export default function MiniDropDown({postInfo,toggle}) {
    const userInfo = UnivuUserInfo(stat=>stat.userInfo);
    const {toggleLoader} = Loader();
    const isLoading = Loader(stat => stat.isTrue);
    let {removePost} = univPostStore();

    const downloadAll = async () => {
        let imgLikeArray = postInfo?.images_url;
        for (let i = 0; i < imgLikeArray.length; i++) {
            let url = imgLikeArray[i];
            
            try {
                let rkv = await fetch(url);
                let blog = await rkv.blob();

                let link = document.createElement("a");
                link.href = URL.createObjectURL(blog);
                link.download = `ImageFrom-${postInfo.username}.${i}.jpg`;
                link.click();

                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error("Download failed:", error);
            }
        }
    }

    const handleClick = async (setting,post_id) => {
        if (isLoading) return;
        try {
            toggleLoader(true)
             await axios.patch("myServer/writePost/toggles",{setting,post_id},{
                headers:{
                    "Content-Type": "application/json"
                }
             })
             location.reload();
        } catch (error) {
            toast.error(error)
        }finally{
            toggleLoader(false)
        }
    }

    const handleReport = async (post_id) => {
        if (isLoading) return;
        try {
            if (!post_id || post_id.length !== 21) {
                throw new Error("Invalid Post_id");
                
            }
            await axios.post("myServer/writePost/reportPost",{post_id},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            toast.success("Reported")
        } catch (error) {
            
            toast.error(error.responce?.data.err || error.message)
        }
    }

    const handleDelete = async (post_id) => {
        if (isLoading) return;
        console.log(post_id)
        try {
            toggleLoader(true)
            if (!post_id || post_id.length !== 21) {
                throw new Error("Invalid Post_id");
                
            }
            // await axios.delete("myServer/writePost/deletePost",
            //             {
            //                 data: { post_id },
            //                 headers: {
            //                     "Content-Type": "application/json"
            //                 }
            //             }
            //         );
            location.reload()
            toast.success("Deleted")
        } catch (error) {
            toast.error(error.responce?.data.err || error.message)
        } finally {
            toggleLoader(false)
        }
    }


    return(
        <div className="miniDropHome h-auto w-55 flex bg-skin-bg/20 backdrop-blur-lg items-center justify-center flex-wrap absolute top-full right-0">
            <ul>
                <li onClick={()=>handleReport(postInfo.post_id)} className="text-red-500 font-bold"><ReportIcon/> Report</li>
                {postInfo.username !== userInfo.username && <li className={`${postInfo?.isFollowing ? "text-red-500" : "text-green-500"} font-bold `}>{postInfo?.isFollowing ? "Following" : "Follow"}</li>}
                <li onClick={downloadAll}> Download</li>
                {postInfo.username === userInfo.username && <>
                <li className={`${(postInfo.likeCount === 1) ? "text-rose-400" : "text-green-500"}`} data-setting={"likeCount"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} >{(postInfo.likeCount === 1) ? "Hide Star Count":"Show start Count"}</li>
                <li className={`${(postInfo.canComment === 1) ? "text-rose-400" : "text-green-500"}`} data-setting={"canComment"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} >{(postInfo.canComment === 1) ? "Trun Off Comment":"Trun On Comment"}</li>
                <li className={`${(postInfo.visibility === 1) ? "text-rose-400" : "text-green-500"}`} data-setting={"visibility"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} >{(postInfo.visibility === 1) ? "Make Private" :"Make Public"}</li>
                <li onClick={()=>handleDelete(postInfo.post_id)} className="text-red-500 font-bold"> Delete</li> </>}
                <li onClick={()=>toggle(false)}> Cancel</li>
            </ul>
        </div>
    )
}