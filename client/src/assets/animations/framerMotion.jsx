import {motion,AnimatePresence} from 'framer-motion';
export default function PageTransition({children,location,shouldAnimat}) {
    return(
        <AnimatePresence mode='wait'>
            <motion.div className='middlerWhere my-scroll'
                key={shouldAnimat ? location.pathname : "static"}
                initial={shouldAnimat ? {x:"100%",opacity:0,scale: .8} : false}
                animate={{x:0,opacity:1,scale:1}}
                exit={shouldAnimat ? {x:"-100%",opacity:0,scale: .8} : false}

                transition={{
                    duration: .8,
                    ease : [0.43,0.13,0.23,0.96],
                }}
                style={{
                    perspective:1500,
                    transformStyle:"preserve-3d",
                }}
            >{children}</motion.div>
        </AnimatePresence>
    )
}