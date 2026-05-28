import { useEffect, useRef } from "react"
import { Link, useNavigation } from "react-router-dom"

export default function PostPriview({post}) {
    // const navi = useNavigation();

   

    return (
        <Link to={`/suggestion/${post?.post_id || "nothings"}`}  className="rounded-md m-px flex items-center justify-center
         p-px  overflow-hidden aspect-square hover:scale-98 transition-all duration-100 cursor-pointer">
            <img loading="lazy" src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </Link>
    )
}