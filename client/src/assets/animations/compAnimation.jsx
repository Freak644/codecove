import {motion,AnimatePresence} from 'framer-motion';

export default function CompAnim({children,className = ""}) {
    return(
        <AnimatePresence mode="wait">
              <motion.div
                className={className}
                key={children.key || "step"}
                initial={{ opacity: 0, rotateX: 90, y: 50 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: -90, y: -50 }}
        
                transition={{
                  duration: 0.5,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                style={{
                  perspective: 1000,
                  transformStyle: "preserve-3d",
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
    )
}