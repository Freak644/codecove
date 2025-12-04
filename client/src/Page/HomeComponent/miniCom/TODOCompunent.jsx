import { useEffect, useState } from "react"

export default function TODOList({crntPost}) {
    const [countArray,setCounts] = useState({
        likeCount:null,
        commentCount:null,
    })
    const [isFetching,setFetching] = useState(true);
    useEffect(()=>{
        console.log(crntPost)
    },[])

    function formatCount(num) {
        if(num === null) return;
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
    }
    return(
        <div className="crntTodo h-1/10 w-full flex items-center justify-around text-skin-ptext">
            <div className="TodoInner">
                <i className="bx bx-star"></i>
                <span>{formatCount(countArray.likeCount)}</span>
            </div>
            <div className="TodoInner">
                <i className="bx bx-comment"></i>
                <span>{formatCount(countArray.commentCount)}</span>
            </div>
            <div className="TodoInner">
                <i className="bx bx-download"></i>
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