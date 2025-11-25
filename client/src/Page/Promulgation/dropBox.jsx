import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload,X,File} from 'lucide-react';
import {toast} from 'react-toastify'
import ImageSlider from './sliderCom';
import { usePostStore } from '../../lib/basicUserinfo';
export default function DragDropBox() {
    const [imgFiles,setImgFiles] = useState([]);
    let {setPostOBJ} = usePostStore();
    const postData = usePostStore(state=>state.postOBJ);
    useEffect(()=>{
        return ()=> {
            imgFiles.forEach(f=>URL.revokeObjectURL(f.preview));
        };
    },[])

    useEffect(()=>{
      setPostOBJ({imgFiles});
    },[imgFiles])

    useEffect(()=>{
      if (postData.imgFiles) {
        setImgFiles(postData.imgFiles);
      }
    },[])

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 5) return toast.info("You can only attach 5 file in single Post")
        const allowTypes = ["png", "jpeg", "jpg"];
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
        multiple: true,
        maxSize: 3 * 1024 * 1024, 
    });




return (
  <div className="flex items-center justify-center p-2 my-scroll">

    {imgFiles.length === 0 &&<motion.div
      {...getRootProps()}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`border-2 flex flex-col border-dashed rounded-2xl p-10 w-full max-w-xl cursor-pointer text-center transition-all duration-300
        ${
          isDragActive
            ? "border-cyan-400/80 bg-black/40 shadow-[0_0_25px_-8px_rgba(6,182,212,0.6)]"
            : "border-gray-700 bg-[#000000a5] hover:border-cyan-400/40 hover:bg-black/80"
        }`}
    >
      <input {...getInputProps()} />

      <motion.div
        animate={{ y: isDragActive ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex flex-col items-center gap-3"
      >
        <Upload className="text-cyan-400 w-12 h-12 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        <p className="text-gray-300 text-lg font-medium">
          {isDragActive
            ? "Drop files here"
            : "Drag & drop or click to browse"}
        </p>
        <p className="text-sm text-gray-500">Max 3MB per image (png, jpg, jpeg)</p>
      </motion.div>
    </motion.div>}

   {imgFiles.length > 0 &&
      <ImageSlider imgArray={imgFiles} setArray={setImgFiles}/>
    }
  </div>
);

}
