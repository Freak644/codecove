import { useEffect, useRef } from "react"

export default function PostPriview({post,i}) {
    const Refs = useRef({});
    const setCallback = (index)=> (el) => {
        Refs.current[index] = el;
    }
    const pattern = [
        "big", "small", "small",
        "small", "small", "big"
    ];

    let type = pattern[i % pattern.length];

    // useEffect(()=>{
        
        
       
    //     let image = item.querySelector("img");

    //     if (image.complete) {
    //         handleResize();
    //     } else {
    //         image.onload = handleResize;
    //     }

    //     window.addEventListener("resize", handleResize);
    //     return ()=> window.removeEventListener("resize", handleResize);
    //},[])
    return (
        <div key={i} className="rounded-md grid-cols-1 grid-rows-1  bg-blue-50">
            <img src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </div>
    )
}