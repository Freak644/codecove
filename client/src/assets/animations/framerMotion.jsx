import {motion,AnimatePresence} from 'framer-motion';
export default function PageTransition({children,location}) {
    return(
        <AnimatePresence mode='wait'>
            <motion.div className='middlerWhere'
                key={location.pathname}
                initial={{x:"100%",opacity:0,scale: .8}}
                animate={{x:0,opacity:1,scale:1}}
                exit={{x:"-100%",opacity:0,scale: .8}}

                transition={{
                    duration: .5,
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