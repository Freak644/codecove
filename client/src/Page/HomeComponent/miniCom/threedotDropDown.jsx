import { useEffect } from "react";
import { UnivuUserInfo } from "../../../lib/basicUserinfo"
import axios from "axios";
import { toast } from "react-toastify";

export default function MiniDropDown({postInfo,toggle}) {
    const userInfo = UnivuUserInfo(stat=>stat.userInfo);

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
        try {
             await axios.put("myServer/PostControll/toggle",{setting,post_id},{
                headers:{
                    "Content-Type": "application/json"
                }
             })
             location.reload();
        } catch (error) {
            toast.error(error)
        }
    }


    return(
        <div className="miniDropHome h-auto w-75 flex items-center justify-center flex-wrap absolute top-full right-0">
            <ul>
                <li className="text-red-500 font-bold"><i className="bx bx-warning"></i> Report</li>
                {postInfo.username !== userInfo.username && <li className={`${postInfo?.isFollowing ? "text-red-500" : "text-green-500"} font-bold cursor-none!`}><i className="bx bx-user"></i>{postInfo?.isFollowing ? "Following" : "Follow"}</li>}
                <li onClick={downloadAll}><i className="bx bx-download"></i> Download</li>
                {postInfo.username === userInfo.username && <>
                <li data-setting={"likeCount"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i name="likeCount" className="bx bxs-start"></i>{(postInfo.likeCount === 1) ? "Hide Star Count":"Show start Count"}</li>
                <li data-setting={"canComment"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i className="bx bx-comment"></i>{(postInfo.canComment === 1) ? "Trun Off Comment":"Trun On Comment"}</li>
                <li data-setting={"visibility"} onClick={(evnt)=>handleClick(evnt.target.dataset.setting,postInfo.post_id)} ><i className="bx bx-lock"></i>{(postInfo.visibility === 1) ? "Make Private" :"Make Public"}</li> </>}
                <li onClick={()=>toggle(false)}>Cancel</li>
            </ul>
        </div>
    )
}