import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom"
const SheetMiddleWhare = lazy(()=> import("./slideMiddleWr"));
import { toast } from "react-toastify";
import axios from 'axios'
const ImageSlider = lazy(()=>import("../../Promulgation/sliderCom"));
import { univPostStore } from "../../../lib/basicUserinfo";
const PostsCon = lazy(()=> import("../postContainer"));

export default function PostANDComment() {
    let {pID} = useParams();
    
    let navi = useNavigate();
    const [crntPost,setCrntPost] = useState({});
    const [isFull,setFull] = useState(false);
    const [crntWidth,setWidth] = useState(0)

    useEffect(()=>{
        getImages();
    },[pID])

    useEffect(()=>{
        setWidth(window.innerWidth)
    },[])
    
    const getImages = async () => {
        try {
            if (!pID || pID.length !== 21) throw new Error("The Link is Broken");
            let result = await axios.get(`/myServer/readPost/getImage?post_id=${pID}`);
          
            if (result.data) {
                setCrntPost(result?.data?.pass)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return(
        <div className="underTaker p-10!">
            { Object.keys(crntPost).length === 0 ? <div className="miniLoader"/> : <>
                <div className="ImageCon md:flex-1 w-100 flex items-center justify-center h-full relative transition-all duration-200">
                    <span className={`md:flex hidden absolute bottom-4 right-5 z-20 text-skin-ptext text-2xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>setFull(prev=>!prev)}>/_\</span>
                    { crntWidth > 768 ? <Suspense fallback={null}>
                        <ImageSlider imgArray={crntPost?.images_url} />
                    </Suspense> :
                        <Suspense fallback={null}>
                            <PostsCon posts={crntPost} />
                        </Suspense>
                    }
                </div>
                { crntWidth >= 768 && <div className={`${isFull ? "w-0!" : "flex-1"} transition-all duration-200 hidden md:flex items-center justify-center h-full`}>
                    <Suspense fallback={<div className="miniLoader"/>}>
                        <SheetMiddleWhare/>
                    </Suspense>
                </div>}
                </>
            }
        </div>
    )
}