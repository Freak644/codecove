import {motion, useMotionValue} from "framer-motion"
import { useRef } from "react"

const Close_throt = 150;
export default function SheetMiddleWhare() {
    const y = useMotionValue(0);
    const sheetRef = useRef(null)
    
    const handleDrag = (_,info) =>{
        const shouldClose = info.offset.y > Close_throt ||
        info.velocity.y > 800;

        if (shouldClose) {
            
        } else {
            y.set(0)
        }
    }
    return(
        <motion.div
        className="underTaker"
        ref={sheetRef}
        drag="y"
        dragConstraints={{top:0}}
        dragElastic={0.2}
        style={y}
        onDragEnd={handleDrag}
        >
            <div className="h-1.5 w-25 rounded-md bg-skin-login" />
        </motion.div>
    )
}