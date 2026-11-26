import { useEffect, useMemo, useRef, useState } from "react"
import { MenuIcon } from "../../utils/SVG/SVG";
import { CheckN, CodeBlock, ImageIcon } from "../../utils/SVG/TODOsvg";
import { DeleteForever, DownArrow, SendSvg } from "../../utils/SVG/menuSVG";
import { usePostStore } from "../../lib/basicUserinfo";
import { toast } from "react-toastify";
import { debouncerGlob } from "../../utils/debounceFun";
import axios from "axios";


export default function Promulgation () {
    const [isClicked, setClicked] = useState(false);
    const [onButton,setButton] = useState("Post");
    const buttonRef = useRef(null);
    
    const postOBJ = usePostStore(stat => stat.postOBJ);
    const {setPostOBJ} = usePostStore();

    const createPost = async (crntPost) => {
        
        const {caption, images_url, postType, post_moment} = crntPost;
        
        try {
            if (!caption || !caption.trim()) return toast.info("Caption !== empty");
            if (!postType || postType !== "moment") return toast.info("")
            if (!images_url || images_url.length < 1) return toast.info("Please Attach an image");
            if (!post_moment.trim()) return toast.warn("Something went wrong") ;
            
            let formData = new FormData();
            Object.keys(postOBJ).forEach(key=>{
                formData.set(key,postOBJ[key]);
            });
            formData.delete("images_url");
            crntPost.images_url.forEach(img=>{
                formData.append("postFiles",img.file);
            })
            setPostOBJ({isUploading:true});
            let responce = await axios.post("/myServer/writePost/CreatePost",formData,{
                headers: {
                    "Content-Type":"multipart/form-data"
                },
                onUploadProgress: (ProgressEvent) => {
                    if (ProgressEvent.total) {
                        const percent = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total);
                        setPostOBJ({progress:percent});
                    }
                }
            });

            let rspInfo = responce?.data?.postData;
            console.log(rspInfo);
            
        } catch (error) {
            console.log(error);
            
            toast.error(error?.response?.data.err || error.message)
        } finally {
            setPostOBJ({isUploading:false});
        }
    }

    const postMiddleware = (postData) => {

        switch (postData.postType) {
            case "moment":
                createPost(postData);
                break;
        }
    }

    const promulgate =  useMemo(()=> {
        return debouncerGlob(postMiddleware);
    })

    return(
        <div className="underTaker flex-row!">
            <div className="leftSideContDiv">
                <CodeBlock/> <MenuIcon/> <ImageIcon/>
            </div>
            <div className="rightSideContDiv justify-end! text-skin-text">
                <p className="saveSpan text-sm flex items-center justify-center text-green-600"><CheckN/> Drafted</p>
                <DeleteForever className="cursor-pointer"/>
                <div className="postButton bg-violet-800/70">
                    <button className="mainButton" onClick={()=>promulgate(postOBJ)}>
                        <SendSvg/> {onButton}
                    </button>
                    <div className="downArrow">
                        <span>|</span>
                        <DownArrow/>
                        <ul className="expenderDiv">
                            <li>Post</li>
                            <li>Project</li>
                            <li>Article</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}