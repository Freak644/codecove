import { useState } from "react"

export default function FloationStart({post_id,like}) {
    const [star,setStar] = useState([])
    
    const handleDoubleClick = evnt=>{
        const elPositions = evnt.currentTarget.getBoundingClientRect();
        let x = evnt.clientX - elPositions.left;
        let y = evnt.clientY - elPositions.top;

        const newStar = {
            id:Date.now(),
            x,
            y
        }

        setStar(prev=>[...prev, newStar]);

        setTimeout(() => {
            setStar((prev)=> prev.filter(star=> star.id !== newStar.id))
        }, 1000);

        handleStar();
    }

    const handleStar = async () => {
        if (like) return;
        try {
            let rqst = await fetch("/myServer/writePost/addStar",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({post_id})
            })
            let result = await rqst.json();
            console.log(result)
            if (result.pass === true) {
                starMp3.play();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="absolute left-1/10 h-full w-8/10 bg-transparent z-2">
            <div onDoubleClick={(evnt)=>handleDoubleClick(evnt)} className="h-full w-full relative">
                {
                    star.map(data=>(
                        <span key={data.id} className="myStar h-15 w-15"
                        style={{
                            position: "absolute",
                            left:data.x,
                            top:data.y,
                            transform:"translate(-50% , -50%)",
                            animation:"floatStar 0.7s ease-out forwards"
                        }}
                        />
                    ))
                }
            </div>
        </div>
    )
}