import { AnimatePresence,motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {Upload,X,File} from 'lucide-react';
import axios from 'axios';
import { Loader } from '../../lib/loader';
import ImageSlider from './sliderCom';
export default function DragDropBox() {
    const [imgFiles,setImgFiles] = useState([])
    const btnRef = useRef();
    const scrollConRef = useRef(null);
    const {isTrue, toggleLoader} = Loader();
    useEffect(()=>{
        return ()=> {
            imgFiles.forEach(f=>URL.revokeObjectURL(f.preview));
        };
    },[])
    const removeFile = (name) => {
      toggleLoader(false)
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
            uploading:false
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

    const scrollCon = ()=>{
      if (scrollConRef.current) {
        scrollConRef.current.scrollBy({top:70, behavior: "smooth" });
      }
    }

const uploadFiles = async () => {
  if(isTrue) return;
  toggleLoader(true);
  for (const img of imgFiles) {
    try {
      const formData = new FormData();
      formData.append("postFile", img.file);

      if (img.uploaded || img.error) continue;
      setImgFiles((prev) =>
        prev.map((file) =>
          file.file.name === img.file.name
            ? { ...file, uploading: true, error: false }
            : file
        )
      );

      const res = await axios.post("/myServer/CreatePost", formData, {
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setImgFiles((prev) =>
            prev.map((file) =>
              file.file.name === img.file.name
                ? { ...file, progress: percent }
                : file
            )
          );
        },
      });

      scrollCon();

      setImgFiles((prev) =>
        prev.map((file) =>
          file.file.name === img.file.name
            ? { ...file, uploaded: true, uploading: false }
            : file
        )
      );

      console.log("✅ Uploaded:", res.data);
    } catch (error) {
      toggleLoader(false)
      console.error("❌ Upload failed:", error);

      let message = "Something went wrong while uploading.";

      if (error.response) {
        message = error.response.data?.err || "Server error during upload.";
      } else if (error.request) {
        message = "Network error: Server not reachable.";
      } else {
        message = error.message;
      }

      setImgFiles((prev) =>
        prev.map((file) =>
          file.file.name === img.file.name
            ? { ...file, uploading: false, error: true }
            : file
        )
      );
      // optional: show alert only once, not for every file
      console.warn(message);
      // 👇 continue to next file automatically (no return!)
    }
  }
  toggleLoader(false);
};




return (
  <div className="h-full relative w-full  flex items-center justify-center p-3 flex-col my-scroll gap-6 my-scroll-visible">

        {imgFiles.length > 0 && <ImageSlider imgArray={imgFiles} />}

    {imgFiles.length === 0 &&<motion.div
      {...getRootProps()}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`border-2 flex flex-col border-dashed rounded-2xl p-10 w-full max-w-xl cursor-pointer text-center transition-all duration-300
        ${
          isDragActive
            ? "border-cyan-400/80 bg-black/70 shadow-[0_0_25px_-8px_rgba(6,182,212,0.6)]"
            : "border-gray-700 bg-[#0e0e0e] hover:border-cyan-400/40 hover:bg-black/60"
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
        <p className="text-sm text-gray-500">Max 5MB per image (png, jpg, jpeg)</p>
      </motion.div>
    </motion.div>}

    {imgFiles.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative max-w-xl bg-black/70 border border-gray-700 rounded-2xl p-5 shadow-inner shadow-cyan-400/10"
      >
        <h2 className="text-gray-200 text-lg font-semibold mb-3">
          Files Ready to Upload
        </h2>
        <div
        ref={scrollConRef}
        className="space-y-3 max-h-60 my-scroll">
          {imgFiles.map(({ file, preview, progress, uploaded,uploading,error }) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${error && "bg-red-400/70"} flex items-center justify-between bg-gray-900/70 px-4 py-3 rounded-lg border border-gray-700 hover:border-cyan-400/30 transition-all`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={preview}
                  alt={file.name}
                  loading="lazy"
                  className="w-10 h-10 object-cover rounded-lg border border-gray-700"
                />
                <div>
                  <p className="font-medium text-gray-100">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {error ? "Failed" :(file.size / 1024).toFixed(2)+"KB"}
                  </p>
                  {progress > 0 && (
                    <div className="w-40 bg-gray-800 rounded-full mt-1 h-2 overflow-hidden">
                      <div
                        className={`${error ? "bg-red-500":"bg-green-500"} h-2 transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {uploaded && (
                  <span className="text-green-400 text-sm">Uploaded</span>
                )}
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-red-400 hover:text-red-500 transition"
                >
                  {uploading?<div className='miniLoader'></div>:<X className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <motion.button ref={btnRef}
            onClick={uploadFiles}
            whileTap={{ scale: 0.97 }}
            className="flex-1 cursor-pointer bg-cyan-500 hover:bg-cyan-800 text-white font-medium py-2.5 rounded-lg shadow-md shadow-cyan-500/20 transition"
          >
            Upload Files
          </motion.button>

          <button disabled={isTrue}
            onClick={() => {
              imgFiles.forEach((f) => URL.revokeObjectURL(f.preview));
              setImgFiles([]);
            }}
            className="px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-cyan-500 transition"
          >
            Clear
          </button>
        </div>
      </motion.div>
    )}
  </div>
);

}