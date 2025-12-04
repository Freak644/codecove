import { useRef } from "react";
import ImageSlider from "../Promulgation/sliderCom"
import Caption from "./miniCom/captionCom";

export default function PostsCon({posts,fetch}) {

    
    function formatCount(num) {
        if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
        if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
    }

    return(
        
            <div className="pl-[8vw] pr-[8vw] h-9/10 flex items-center justify-center p-5 flex-wrap my-scroll gap-6">
                {
                    posts.map(({caption,caComment,images_url,canSave,post_id,username,avatar,post_moment})=>{
                        return(
                            <div key={post_id} className="flex items-start flex-col h-full gap-3 w-[450px] singlePost rounded-lg">
                                <div className="ownInfo h-2/12 flex items-start justify-between flex-wrap p-1 gap-1.5 text-skin-text w-full rounded-lg">
                                    <div className="innerINFODiv p-1 flex items-start flex-1 gap-2.5">
                                        <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                                        <p className="text-lg flex items-center gap-2"><span>{username}</span> <span className="font-bold text-sm">/{post_moment}</span></p>
                                    </div>
                                    <div className="innerINFODiv flex-1 flex items-center justify-end relative!">
                                        <i className='bx bx-dots-vertical-rounded text-2xl'></i>
                                    </div>
                                    <Caption text={caption} />
                                </div>
                                <div className="imgContainer w-full h-7/10 flex items-center">
                                     <ImageSlider imgArray={images_url} />
                                </div>
                                <div className="crntTodo h-1/10 w-full flex items-center justify-around text-skin-ptext">
                                    <div className="TodoInner">
                                        <i className="bx bx-star"></i>
                                        <span>999</span>
                                    </div>
                                    <div className="TodoInner">
                                        <i className="bx bx-comment"></i>
                                        <span>999</span>
                                    </div>
                                    <div className="TodoInner">
                                        <i className="bx bx-download"></i>
                                        <span>999</span>
                                    </div>
                                    <div className="TodoInner">
                                        <i className="bx bx-bookmark"></i>
                                        <span>999</span>
                                    </div>
                                    <div className="TodoInner perspective-distant">
                                        <i className="bx bxs-share transform-3d rotate-y-180"></i>
                                        <span>999</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        
    )
}