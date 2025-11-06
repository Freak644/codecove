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
            className='absolute -left-8 bg-black text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'
            >
                ⟵
            </button>

            {/* slider or imgCOntainer */}
            <div className='overflow-hidden w-[250px] rounded-2xl'>
                <motion.div
                className='flex gap-5'
                animate={{x: -index * 270}}
                transition={{type:"spring",stiffness:200,damping:20}}
                >
                    {
                        imgArray.map(({file,preview})=>(
                            <motion.img
                            key={file.name}
                            src={preview}
                            className='w-[250px] h-auto object-cover rounded-2xl'
                            >

                            </motion.img>
                        ))
                    }
                </motion.div>
            </div>
            {/* right button */}
            <button onClick={nextImg}
            className='absolute -right-8 bg-black text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'
            >
                ⟶
            </button>
        </div>
    )
}