import { useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import SheetMiddleWhare from "./slideMiddleWr";
import { toast } from "react-toastify";
import axios from 'axios'
import ImageSlider from "../../Promulgation/sliderCom";
import POSTSkeloten from "../skeleton/noBGSkeleton";

export default function PostANDComment() {
    let {pID} = useParams();
    let navi = useNavigate();
    const [crntPost,setCrntPost] = useState([]);
    const [isFull,setFull] = useState(false);

    useEffect(()=>{
        console.log(crntPost.length)
        getImages();
    },[pID])
    
    const getImages = async () => {
        try {
            if (!pID || pID.length !== 21) throw new Error("The Link is Broken");
            let result = await axios.get(`/myServer/readPost/getImage?post_id=${pID}`);
           // console.log(result)
            if (result.data) {
                setCrntPost(result?.data?.pass)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return(
        <div className="underTaker p-10!">
            { crntPost.length === 0 ? <POSTSkeloten/> : <>
                <div className="ImageCon flex-1  flex items-center justify-center h-full relative transition-all duration-200">
                    <i className={`bx bx${isFull ? "-exit-" : "-"}fullscreen absolute bottom-4 right-5 z-20 text-skin-ptext text-2xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>setFull(prev=>!prev)}></i>
                    <ImageSlider imgArray={crntPost} />
                </div>
                <div className={`${isFull ? "w-0!" : "flex-1"} transition-all duration-200 flex items-center justify-center h-full`}>
                    <SheetMiddleWhare/>
                </div>
                </>
            }
        </div>
    )
}