import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload,X,File} from 'lucide-react';
import {toast} from 'react-toastify'

import { usePostStore } from '../../lib/basicUserinfo';
import { ImageIcon } from '../../utils/SVG/TODOsvg';
export default function DragDropBox({inHidden}) {
    const [imgFiles,setImgFiles] = useState([]);
    let {setPostOBJ} = usePostStore();
    const postData = usePostStore(state=>state.postOBJ);
    useEffect(()=>{
        return ()=> {
            imgFiles.forEach(f=>URL.revokeObjectURL(f.preview));
        };
    },[])

    useEffect(()=>{
     
      setPostOBJ({images_url:imgFiles});
    },[imgFiles])

    useEffect(()=>{
      if (postData.imgFiles) {
        setImgFiles(postData.imgFiles);
      }
    },[])

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 5) return toast.info("You can only attach 5 file in single Post")
        const allowTypes = ["png", "jpeg", "jpg"];
      console.log(acceptedFiles)
        const maxSize = 3 * 1024 * 1024; // 5MB per file

        const validFiles = [];
        const errors = [];

        acceptedFiles.forEach((file) => {
            const ext = file.type.split("/")[1]?.toLowerCase();

            if (!allowTypes.includes(ext)) {
            errors.push(`${file.name}: Unsupported file type`);
            return;
            }

            if (file.size > maxSize) {
            errors.push(`${file.name}: File size exceeds 3MB limit`);
            return;
            }

            validFiles.push({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            uploading:false
            });
        });

        if (errors.length > 0) {
            toast.warning(errors[0])
        }

        if (validFiles.length > 0) {
            setImgFiles((prev) => [...prev, ...validFiles]);
        }
        }, []);

    const {getRootProps,getInputProps,isDragActive} = useDropzone({
        onDrop,
        multiple: true
    });




return (
  <div className={`${inHidden ? "hidden" : "flex"} h-full w-full relative items-start justify-center`}>

    {<motion.div
      {...getRootProps()}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={` flex flex-col rounded-2xl w-full max-w-xl cursor-pointer text-center transition-all duration-300 p-1
        ${
          isDragActive
            ? "border-cyan-400/80 shadow-[0_0_25px_-8px_rgba(6,182,212,0.6)]"
            : "border-gray-700  hover:border-cyan-400/40 hover:bg-black/8"
        }`}
    >
      <input {...getInputProps()} />

      <motion.div
        animate={{ y: isDragActive ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex flex-col items-center gap-3"
      >
        <div className='flex items-center justify-start w-full font-bold'><ImageIcon className="h-2.5 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" /> Image</div>
        <p className="text-gray-300 text-[10px] font-bold flex items-center justify-start w-26">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop or click to browse"}
        </p>
       
      </motion.div>
    </motion.div>}

   {/* {imgFiles.length > 0 &&
      <ImageSlider imgArray={imgFiles} setArray={setImgFiles}/>
    } */}
  </div>
);

}
