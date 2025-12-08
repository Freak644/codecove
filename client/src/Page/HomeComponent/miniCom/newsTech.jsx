import { useEffect, useState } from "react"
import NewsSkel from "../skeleton/newsSkeleton";

export default function NewsComp() {
    const [news,setnews] = useState([]);

    const fetchData = async () => {
        let data = await fetch("/myServer/getNews");
        let newsArray = await data.json();
        console.log(newsArray)
        setnews(newsArray.formatted)
    }

    useEffect(()=>{
        fetchData();
    },[])

    return(
        <div className="underTaker flex-wrap my-scroll p-4">
            { news.length !== 0 ? (news.map(news=>{
                    let {image,url,title} = news;
                    return(
                        <div key={url} onClick={()=>window.open(url)} className="newsDiv flex items-center flex-row relative w-full p-2 overflow-hidden">
                            <div className=" h-full w-full">
                                <img className="object-cover" src={image} alt="Image" />
                            </div>
                            <p className="text-wrap text-white -bottom-10 hover:bottom-0 transition-all duration-700
                            bg-black/5 absolute p-4 backdrop-blur-md">{title}</p>
                        </div>
                    )
                })) : (<NewsSkel/>)
            }
        </div>
    )
}