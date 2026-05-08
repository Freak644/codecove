import { useEffect, useRef } from "react"

export default function PostPriview({post,i}) {

    
    return (
        <div key={i}   className="rounded-md m-px flex items-center justify-center p-px  overflow-hidden aspect-square hover:scale-98 transition-all duration-100 cursor-pointer">
            <img loading="lazy" src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </div>
    )
}