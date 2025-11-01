import {motion, progress} from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload,X,File} from 'lucide-react'
export default function DragDropBox() {
    const [imgFiles,setImgFiles] = useState([])

    useEffect(()=>{
        return ()=> {
            imgFiles.forEach(f=>URL.revokeObjectURL(f.preview));
        };
    },[])
    const removeFile = (name) => {
        setImgFiles((prev) => {
        const toRemove = prev.find((p) => p.file.name === name);
        if (toRemove) URL.revokeObjectURL(toRemove.preview);
        return prev.filter((f) => f.file.name !== name);
        });
    };

    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles)
        const allowTypes = ["png", "jpeg", "jpg"];
        const maxSize = 5 * 1024 * 1024; // 5MB per file

        const validFiles = [];
        const errors = [];

        acceptedFiles.forEach((file) => {
            const ext = file.type.split("/")[1]?.toLowerCase();

            if (!allowTypes.includes(ext)) {
            errors.push(`${file.name}: Unsupported file type`);
            return;
            }

            if (file.size > maxSize) {
            errors.push(`${file.name}: File size exceeds 5MB limit`);
            return;
            }

            validFiles.push({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            });
        });

        if (errors.length > 0) {
            alert(errors.join("\n")); // you can replace this with toast or UI message
        }

        if (validFiles.length > 0) {
            setImgFiles((prev) => [...prev, ...validFiles]);
        }
        }, []);

    const {getRootProps,getInputProps,isDragActive} = useDropzone({
        onDrop,
        multiple: true,
        maxSize: 5 * 1024 * 1024, // size 5MB
    });

    
    return(
        <div className="underTaker">
            <motion.div
             {...getRootProps()}
             initial={{scale:0.95, opacity:0}}
             animate={{scale:1,opacity:1}}
             whileHover={{scale:1.02}}
             className={`border-2 border-dashed rounded-2xl p-10 w-full max-w-xl cursor-pointer text-center transition-all duration-300 ${
                isDragActive
                ? "border-cyan-500 bg-slate-800/60 shadow-lg shadow-cya/20"
                : "border-gray-600 bg-slate-800/40 hover:bg-slate-800/60"
             }`}
             >
                <input {...getInputProps()} />

                <motion.div
                animate={{y: isDragActive ? -6 : 0}}
                transition={{type: "spring", stiffness: 200 }}
                className='flex flex-col items-center justify-center gap-3'
                >
                    <Upload className='text-cyan-400 w-12 h-12' />
                    <p className='text-skin-ptext text-lg'>
                        {isDragActive
                        ? "Drop file to Here"
                        : "Drag & Drop file here or click to browse"
                        }
                    </p>
                </motion.div>
             </motion.div>
            {imgFiles.length>0 && (
                <motion.div
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                className='mt-8 w-full max-w-xl my-scroll bg-slate-800/60 border border-gray-700 rounded-xl p-4'
                >
                    <h2 className='text-skin-ptext text-lg font-semibold mb-3'>Files Ready to Upload</h2>
                    <div className="space-y-2">

                    </div>
                </motion.div>
            )}
        </div>
    )
}