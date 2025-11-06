import {motion} from 'framer-motion';
import { useState } from 'react';
export default function ImageSlider({imgArray}) {
    const [index,setIndex] = useState(0)
    const nextImg = ()=> setIndex(prev => (prev+1)%imgArray.length);
    const prevImg = ()=> setIndex(prev => (prev-1 + imgArray.length) % imgArray.length);
    return(
        <div className="relative flex items-center justify-center w-[270px] mx-auto">
            {/* left button */}
            <button onClick={prevImg}
            className='absolute z-10 left-0 bg-transparent text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'
            >
                ⟵
            </button>

            {/* slider or imgCOntainer */}
            <div className='overflow-hidden z-1 h-400px w-[250px] rounded-2xl bg-skin-bg'>
                <motion.div
                className='flex gap-5 items-center'
                animate={{x: -index * 270}}
                transition={{type:"spring",stiffness:200,damping:20}}
                drag="x"
                dragConstraints={{left:0,right:0}}
                onDragEnd={(evnt,info)=>{
                    if (info.offset.x < -100) nextImg()
                    else if(info.offset.x > 100) prevImg()
                     }}
                > 
                        {
                            imgArray.map(({file,preview})=>{
                                let isPro = file.width < file.height;
                            return(
                                    <motion.img
                                    key={file.name}
                                    src={preview}
                                    className={`h-full w-full object-cover  rounded-2xl flex`}
                                    />
                            )})
                        }
                </motion.div>
            </div>
            {/* right button */}
            <button onClick={nextImg}
            className='absolute z-10 right-0 bg-transparent text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'
            >
                ⟶
            </button>
        </div>
    )
}