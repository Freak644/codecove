import { useEffect, useState } from "react"

export default function BaseExplore() {
    const [isPadding, setPadding] = useState(true);
    useEffect(()=> {
        let width = window.innerWidth;
        if (width<800) {
            
        }
    },[])

    return(
        <div className={`underTaker  ${isPadding && "bg-linear-to-tl from-yellow-500/20 to-purple-500/20 via-pink-500/20 p-2.5"}`}>
            
        </div>
    )
}