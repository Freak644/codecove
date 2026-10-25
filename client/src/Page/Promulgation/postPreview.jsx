import { useEffect } from "react";
import { UnivuUserInfo, usePostStore } from "../../lib/basicUserinfo";
import { EyeOpn } from "../../utils/SVG/menuSVG";
import PostsCon from "../DashboardLayout/postContainer";

export default function PostPreview () {
    const {username, avatar, name} = UnivuUserInfo(stat=>stat.userInfo);
    const {caption, images_url, canSave,isLiked, canComment,post_id,post_moment,likeCount,visibility,totalLike,isFollowing} = usePostStore(stat=>stat.postOBJ);


    return(
        <div className="underTaker flex-col! text-skin-text pointer-events-none">
                <div className="headingDiv">
                    <EyeOpn className="text-skin-ptext!"/> Preview
                </div>

                <div className="h-[95%] w-full flex items-start flex-col pt-3">
                    <PostsCon posts={{
                        caption:caption || "",
                        canComment,
                        images_url,
                        canSave,
                        ownerName:name,
                        post_id,
                        username,
                        avatar,
                        post_moment,
                        isLiked,
                        likeCount,
                        visibility, 
                        totalLike,
                        isFollowing
                    }}/>
                </div>
        </div>
    )
}