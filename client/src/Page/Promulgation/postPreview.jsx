import { EyeOpn } from "../../utils/SVG/menuSVG";
import PostsCon from "../DashboardLayout/postContainer";

export default function PostPreview () {
    const tempPost = {
        caption:"Just puched a small utility",
        canComment:false,
        image_url: ["https://i.postimg.cc/bNSNbS5G/kiara-Anime.jpg"],
        canSave:true,
        ownerName:"Ethan Hunt",
        post_id:"9017823jkskdjf",
        username:"loser_321",
        avatar:"https://i.postimg.cc/bNSNbS5G/kiara-Anime.jpg",
        post_moment:"Bug",
        likeCount:false,
        isLiked:false,
        visibility:true, 
        totalLike:999,
        isFollowing:false
    }
    return(
        <div className="underTaker flex-col! text-skin-text pointer-events-none">
                <div className="headingDiv">
                    <EyeOpn className="text-skin-ptext!"/> Preview
                </div>

                <div className="h-[95%] w-full flex items-start flex-col pt-3">
                    <PostsCon posts={tempPost}/>
                </div>
        </div>
    )
}