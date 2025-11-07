import {motion} from 'framer-motion';
import { useState } from 'react';
export default function ImageSlider({imgArray,setArray}) {
    const [index,setIndex] = useState(0)
    const nextImg = ()=> setIndex(prev => (prev+1)%imgArray.length);
    const prevImg = ()=> setIndex(prev => (prev-1 + imgArray.length) % imgArray.length);
    const removeFile = ()=>{
        console.log(index)
        setArray(prev=>{
            const toRemove = prev[index];
            if (toRemove) URL.revokeObjectURL(toRemove.preview);
            const newArr = prev.filter((_, i) => i !== index);
            if (newArr.length === 0) {
            setIndex(0);
            } else if (index >= newArr.length) {
            setIndex(newArr.length - 1);
            }

            return newArr;
        })
    }
    return(
        <div className="relative h-full flex items-center justify-center w-[270px]">
            {/* left button */}
            <button onClick={prevImg}
            className='absolute z-10 left-0 bg-transparent text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'
            >
                ⟵
            </button>
            <button onClick={removeFile} className='absolute cursor-pointer z-10 right-0 top-0 bg-transparent text-red-600 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600  text-lg transition duration-100'>
                X
            </button>
            {/* slider or imgCOntainer */}
            <div className='overflow-hidden h-full flex items-center z-1 w-[250px] rounded-2xl bg-skin-bg'>
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
                            return(
                                        <motion.img
                                            title={file.name}
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