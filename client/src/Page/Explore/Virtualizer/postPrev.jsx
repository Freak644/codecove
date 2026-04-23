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

        const ClassLogic = ()=>{
            let width = image.naturalWidth;
            let height = image.naturalHeight;
            let ratio = width / height;
            let parentDiv = image.parentElement;
            console.log(ratio)
            if (ratio > 0.8 && ratio < 1.2) {
               parentDiv.classList.add("square");
            } else if (ratio >= 1.2) {
                parentDiv.classList.add("landscape")
            } else {
                parentDiv.classList.add("portrait")
            }
        }
       
        if (image.complete) {
            ClassLogic();
        } else {
            image.onload = ClassLogic;
        }
        
    },[])
    return (
        <div key={i} ref={setCallback(i)} className="rounded-md bg-blue-50 flex items-center justify-center p-px  overflow-hidden">
            <img loading="lazy" src={post?.images_url[0]} alt="" className="h-full w-full object-cover block" />
        </div>
    )
}