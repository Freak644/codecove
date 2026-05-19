import { useEffect, useMemo, useRef, useState } from "react";
import { univPostStore } from "../../../../lib/basicUserinfo"
import { StarFilledIcon } from "../../../../utils/SVG/SVG";
import { RocketFire, RocketIcon } from "../../../../utils/SVG/TODOsvg";
import {starAudio} from '../../../../utils/sound';
import { debouncerGlob } from "../../../../utils/debounceFun";
import { formatCount } from "../../../../utils/formatCount";
export default function LikeCom({Data}) {
    let {setUnivPost} = univPostStore();
    // const [postInfo,setInfo] = useState({});
    const contanerRef = useRef(null);
    let {totalLike, isLiked, post_id,likeCount, totalDislike, isDisliked} = Data || {};
    
    // useEffect(()=>{
    //     setInfo(Data);
    // },[Data])
    // useEffect(()=>{
    //     console.log(postInfo)
    // },[postInfo])

    const handelCount = ({likeStat}) => {
        setUnivPost({
            [post_id]:{
                totalLike: likeStat ? totalLike + 1 : totalLike -1,
                totalDislike: isDisliked ? totalDislike - 1 : totalDislike,
                isDisliked: false,
                isLiked:likeStat
            }
        });
        // setInfo(prev=>({
        //     ...prev,
        //         isLiked:likeStat
        // }))
        
        if (likeStat) {
            const element = contanerRef.current;

                    if (element) {
                        element.classList.add("starAnimActive");
                    }
                const timeout = setTimeout(() => {
                    const element = contanerRef.current;

                    if (element) {
                        element.classList.remove("starAnimActive");
                    }
                }, 1000);
        }

        starAudio.currentTime = 0;
        starAudio.play();
  
    }

    const handleStar = async (post_id, isLiked) => {
        let likeStat = !isLiked;
        // console.log(post_id,likeStat)
        try {
            if (!post_id) return;
            handelCount({likeStat})
            let rqst = await fetch("/myServer/writePost/addStar",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({post_id})
            })
            let result = await rqst.json();
            if (result.err) {
                throw new Error("Server side error");
                
            }
        } catch (error) {
            console.log(error)
        }
    }

    const starDeboun = useMemo(()=> {
        return debouncerGlob(handleStar);
    },[])

    
    return(
        <div className="underTaker cursor-pointer relative">
             <div className="underTaker" ref={contanerRef} onClick={()=>starDeboun(post_id,isLiked)}>
                {!isLiked ? <RocketIcon customClass={"svgicon"}/> : <StarFilledIcon className={"svgicon"}/>}
                    <span>{likeCount ? formatCount(totalLike) : ""}</span>
                <div className="onHoverDiv">
                    <div className="underTaker  perspective-midrange transform-3d">
                        <div className="svgHolderR">
                            <RocketIcon customClass={"svgMoverR"}/>
                        </div>
                        <div className="starStarHolder">
                            <StarFilledIcon className={"svgMover"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}