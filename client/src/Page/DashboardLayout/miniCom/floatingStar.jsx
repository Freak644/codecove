import { useState } from "react"
import { univPostStore } from "../../../lib/basicUserinfo";
import star from '../../../assets/Sounds/star.mp3'
export default function FloationStart({post_id,like,totalLike}) {
    const [handleStar,setStar] = useState([]);
    let {setUnivPost} = univPostStore();
    const starMp3 = new Audio(star);
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
            setStar((prev)=> prev.filter(handleStar=> handleStar.id !== newStar.id))
        }, 1000);

        handleSubmit();
    }

    const handleSubmit = async () => {
        if (like) return;
        try {
            setUnivPost({
                [post_id]:{
                    totalLike: totalLike + 1,
                    isLiked:true
                }
            })
            starMp3.play();
            let rqst = await fetch("/myServer/writePost/addStar",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify({post_id})
            })
            let result = await rqst.json();
            if (result.err) {
                throw new Error(result.err);
                
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return(
        <div className="absolute left-1/10 h-full w-8/10 bg-transparent z-2">
            <div onDoubleClick={(evnt)=>handleDoubleClick(evnt)} className="h-full w-full relative">
                {
                    handleStar.map(data=>(
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