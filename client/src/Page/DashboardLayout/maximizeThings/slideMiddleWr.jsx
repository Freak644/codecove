import {motion, useMotionValue} from "framer-motion"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import CommentEl from "./commentContainer";

const Close_throt = 220;
export default function SheetMiddleWhare() {
    const y = useMotionValue(0);
    const sheetRef = useRef(null)
    const navi = useNavigate();
    const [isDraging,setDrag] = useState(false)
    
    const handleDrag = (_,info) =>{
        const isDraging = info.offset.y > 0;
        const shouldClose = isDraging && (info.offset.y > Close_throt ||
        info.velocity.y > 800);
        if (shouldClose) {
            navi(-1)
        } else {
            y.set(0)
        }
        setDrag(false)
    }
    return(
        <motion.div
        className="h-full w-full relative"
        ref={sheetRef}
        drag="y"
        dragConstraints={{top:0}}
        dragElastic={0.2}
        style={{y}}
        onDragStart={()=>setDrag(true)}
        onDragEnd={handleDrag}
        >
            <div className="h-1.5 w-30 md:hidden rounded-md top-1 absolute left-2/6 bg-skin-login" />

            <div className={`underTaker ${isDraging && "overflow-hidden!"}`}>
                <CommentEl/>
            </div>
        </motion.div>
    )
}