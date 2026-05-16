import { useRef } from "react";
import { univPostStore } from "../../../../lib/basicUserinfo"
import { DislikeFill, DislikeOL } from "../../../../utils/SVG/TODOsvg";
import { formatCount } from "../../../../utils/formatCount";

export default function DisLikeCom({Data}) {
    let {setUnivPost} = univPostStore();
    const contanerRef = useRef(null);
    let {totalDislike, isDisliked, post_id, likeCount, totalLike, isLiked} = Data || {};

    const handelCounts = (dislikeStat) => {
        console.log(post_id)
        // let dislikeStat = true;

            setUnivPost({
                [post_id]:{
                    totalLike: isLiked ? totalLike - 1 : totalLike,
                    totalDisLike: dislikeStat ? totalDislike + 1 : totalDislike - 1,
                    isDisliked: dislikeStat,
                    isLiked: false
                }
            })
    }

    return(
        <div className="underTaker gap-1" ref={contanerRef} onClick={()=>handelCounts(isDisliked, isLiked)}>
            {isDisliked ? <DislikeFill customClass={"svgicon"}/> : <DislikeOL customClass={"svgicon"}/>}
            <span>{likeCount ? formatCount(totalDislike) : ''}</span>
        </div>
    )
}