import { useMemo, useRef } from "react";
import { univPostStore } from "../../../../lib/basicUserinfo"
import { DislikeFill, DislikeOL } from "../../../../utils/SVG/TODOsvg";
import { formatCount } from "../../../../utils/formatCount";
import {toast} from "react-toastify"
import { debouncerGlob } from "../../../../utils/debounceFun";

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
                    totalDislike : dislikeStat ? totalDislike + 1 : totalDislike - 1,
                    isDisliked: dislikeStat,
                    isLiked: false
                }
            })
    }

    const handleDisLike = async (post_id, isLiked, disLike) => {
        let dlStat = !isDisliked;
        console.log(dlStat)
        try {
            if (!post_id) return;
            handelCounts(dlStat);
            let rqst = await fetch("/myServer/writePost/addDislike",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({post_id})
            });
            let result = await rqst.json();
            if (result.err) {
                throw new Error(result.err);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const disLikeDebounce = useMemo(()=> {
        return debouncerGlob(handleDisLike);
    },[])
    return(
        <div className="underTaker cursor-pointer gap-1" ref={contanerRef} onClick={()=>handleDisLike(post_id,isDisliked, isLiked)}>
            {isDisliked ? <DislikeFill className={"svgicon"}/> : <DislikeOL className={"svgicon"}/>}
            <span>{likeCount ? formatCount(totalDislike) : ''}</span>
        </div>
    )
}