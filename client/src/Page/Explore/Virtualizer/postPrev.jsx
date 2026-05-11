import { useEffect, useRef } from "react"
import { useNavigation } from "react-router-dom"

export default function PostPriview({post,i}) {
    // const navi = useNavigation();

    const handleClick = (postId)=> {
        console.log(postId)
    }

    return (
        <div key={i} onClick={()=>handleClick(post.post_id)}  className="rounded-md m-px flex items-center justify-center p-px  overflow-hidden aspect-square hover:scale-98 transition-all duration-100 cursor-pointer">
            <img loading="lazy" src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </div>
    )
}