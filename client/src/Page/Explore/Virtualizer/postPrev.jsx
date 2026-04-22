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

    useEffect(()=>{
        let item = Refs.current[i];
       
        let image = item.querySelector("img");

        console.log(image.naturalWidth, image.naturalHeight);
    },[])
    return (
        <div key={i} ref={setCallback(i)} className="rounded-md bg-blue-50 flex items-center justify-center p-px  overflow-hidden">
            <img src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </div>
    )
}