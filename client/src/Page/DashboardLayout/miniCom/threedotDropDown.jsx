import { useEffect } from "react";
import { UnivuUserInfo } from "../../../lib/basicUserinfo"
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "../../../lib/loader";

export default function MiniDropDown({postInfo,toggle}) {
    const userInfo = UnivuUserInfo(stat=>stat.userInfo);
    const {toggleLoader} = Loader();
    const isLoading = Loader(stat => stat.isTrue);

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
             await axios.put("myServer/PostControll/toggle",{setting,post_id},{
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
            await axios.put("myServer/reportPost",{post_id},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            toast.success("Reported")
        } catch (error) {
            toast.error(error.responce.data.err || error.message)
        }
    }

    const handleDelete = async (post_id) => {
        if (isLoading) return;
        try {
            toggleLoader(true)
            if (!post_id || post_id.length !== 21) {
                throw new Error("Invalid Post_id");
                
            }
            await axios.put("myServer/reportPost",{post_id},{
                headers:{
                    "Content-Type":"application/json"
                }
            })
            toast.success("Reported")
        } catch (error) {
            toast.error(error.responce.data.err || error.message)
        } finally {
            toggleLoader(false)
        }
    }


    return(
        <div className="miniDropHome h-auto w-55 flex bg-skin-bg/20 backdrop-blur-lg items-center justify-center flex-wrap absolute top-full right-0">
            <ul>
                <li onClick={()=>handleReport(postInfo.post_id)} className="text-red-500 font-bold"><i className="bx bx-error"></i> Report</li>
                {postInfo.username !== userInfo.username && <li className={`${postInfo?.isFollowing ? "text-red-500" : "text-green-500"} font-bold cursor-none!`}><i className="bx bx-user"></i>{postInfo?.isFollowing ? "Following" : "Follow"}</li>}
                <li onClick={downloadAll}><i className="bx bx-download"></i> Download</li>
                {postInfo.username === userInfo.username && <>
                <li className={`${(postInfo.likeCount === 1) ? "text-gray-400" : "text-green-500"}`} data-setting={"likeCount"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i name="likeCount" className="bx bxs-star"></i>{(postInfo.likeCount === 1) ? "Hide Star Count":"Show start Count"}</li>
                <li className={`${(postInfo.canComment === 1) ? "text-gray-400" : "text-green-500"}`} data-setting={"canComment"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i className="bx bx-comment"></i>{(postInfo.canComment === 1) ? "Trun Off Comment":"Trun On Comment"}</li>
                <li className={`${(postInfo.visibility === 1) ? "text-gray-400" : "text-green-500"}`} data-setting={"visibility"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i className="bx bx-lock"></i>{(postInfo.visibility === 1) ? "Make Private" :"Make Public"}</li>
                <li onClick={()=>handleDelete(postInfo.post_id)} className="text-red-500 font-bold"> <i className="bx bx-trash"></i> Delete</li> </>}
                <li onClick={()=>toggle(false)}><i className="bx bx-x"></i> Cancel</li>
            </ul>
        </div>
    )
}