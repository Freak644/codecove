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

    const uploadFiles = async () => {
        
    }

    return(
        <div className="underTaker flex gap-4">
            <motion.div
             {...getRootProps()}
             initial={{scale:0.95, opacity:0}}
             animate={{scale:1,opacity:1}}
             whileHover={{scale:1.02}}
             className={`border-2 flex flex-col border-dashed rounded-2xl p-10 w-full max-w-xl cursor-pointer text-center transition-all duration-300 ${
                isDragActive
                ? "border-cyan-500 bg-slate-800/60 shadow-lg shadow-cya/20"
                : "border-gray-600 bg-slate-800/40 hover:bg-slate-800/60"
             }`}
             >
                <input {...getInputProps()} />

                <motion.div
                animate={{y: isDragActive ? -6 : 0}}
                transition={{type: "spring", stiffness: 200 }}
                className='flex flex-col items-center  gap-3'
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
                className='mt-8 w-full max-w-xl  bg-slate-800/60 border border-gray-700 rounded-xl p-4'
                >
                    <h2 className='text-skin-ptext text-lg font-semibold mb-3'>Files Ready to Upload</h2>
                    <div className="space-y-2 h-42 my-scroll">
                        {imgFiles.map(({file,preview,progress,uploaded})=> (
                            <motion.div
                            key={file.name}
                            initial={{opacity: 0 ,x: -10 }}
                            animate={{opacity:1,x:0}}
                            className='flex items-center justify-between bg-slate-700/50 px-3 py-2 rounded-lg text-skin-ptext'
                            >
                                <div className="flex items-center gap-3">
                                    <img src={preview} alt={file.name} loading='lazy' className='w-8 h-8 object-cover rounded' />
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                                        {progress > 0 && (
                                        <div className="w-40 bg-slate-600 rounded-full mt-1 h-2 overflow-hidden">
                                            jhon
                                            <div className="bg-cyan-400 h-2" style={{ width: `${progress}%` }} />
                                        </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {uploaded ? <span className="text-green-300 text-sm">Uploaded</span> : null}
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        className="text-red-400 hover:text-red-500 transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    </div>   
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-3">
                        <motion.button
                            onClick={uploadFiles}
                            whileTap={{ scale: 0.97 }}
                            className="flex-1 cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition"
                            >
                            Upload Files
                            </motion.button>

                            <button
                            onClick={() => {
                                // clear all
                                imgFiles.forEach((f) => URL.revokeObjectURL(f.preview));
                                setImgFiles([])
                            }}
                            className="px-4 cursor-pointer py-2 rounded-lg border border-gray-600 text-gray-200"
                            >
                            Clear
                            </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}