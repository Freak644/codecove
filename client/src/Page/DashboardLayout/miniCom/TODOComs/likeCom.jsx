import { univPostStore } from "../../../../lib/basicUserinfo"
import { RocketFire, RocketIcon } from "../../../../utils/SVG/TODOsvg";

export function LikeCom({Data}) {
    let {setUnivPost} = univPostStore();
    let {totalLike, isLiked, post_id} = Data;
    return(
        <div className="underTaker">
            {!isLiked ? <RocketIcon customClass={"svgicon"}/> : <RocketFire/>}
        </div>
    )
}