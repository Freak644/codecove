import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
const ImageSlider = lazy(()=> import("../../Promulgation/sliderCom"))
import { univPostStore } from "../../../lib/basicUserinfo";
const SheetMiddleWhare = lazy(()=> import("./slideMiddleWr"));
import {createContext} from 'react';
import { MdFullscreenExit, MdFullscreen } from "react-icons/md";
export const btnContext = createContext();
export default function MaximizeContainer({pramPost}) {
    let {pID} = useParams();
    if (!pID) {
        pID = pramPost;
    }
    let navi = useNavigate();
    let containerRef = useRef(null);
    const postData = univPostStore(stat=>stat.postsById[pID]);
    const [crntPost,setCrntPost] = useState({});
    const [isFull,setFull] = useState(false);
    const [toggleBtn,setToggel] = useState(false); 
    
    useEffect(()=>{
        setCrntPost(postData)
    },[postData]);

    useEffect(()=>{
        const handleClick = evnt=>{
            console.log(evnt.target)
            const el = containerRef.current;
            if (el && !el.contains(evnt.target) && !toggleBtn) {
                navi(-1);
            }
            setToggel(false)
        }
        document.addEventListener("click",handleClick);
        return ()=> document.removeEventListener("click",handleClick);
    },[toggleBtn])

    return(
            <div className="underTaker ">
                <div className="closeBtn hidden md:flex items-center justify-center p-3 rounded-full text-[18px] font-bold absolute top-5 right-2">
                    <button className="cursor-pointer hover:rotate-180 transition-all duration-300 text-red-600 hover:bg-gray-500/70 rounded-full
                    h-9 w-9" 
                    
                    >
                        X
                    </button>
                </div>
                <div ref={containerRef} className="commentAndImage h-9/10 w-5/6 rounded-lg p-2 flex items-center justify-center flex-wrap bg-black/80  md:bg-gray-800/70 backdrop-blur-lg">
                    <div className="ImageCon flex-1  flex items-center justify-center h-full relative transition-all duration-200">
                        {isFull ? <MdFullscreenExit className={`absolute bottom-4 right-5 z-20 text-skin-ptext text-4xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>{setFull(prev=>!prev), setToggel(true)}} /> : <MdFullscreen className={`absolute bottom-4 right-5 z-20 text-skin-ptext text-4xl bg-black p-2 cursor-pointer rounded-full`} onClick={()=>{setFull(prev=>!prev), setToggel(true)}} />}
                        <Suspense fallback={<div className="miniLoader" />}>
                            <ImageSlider imgArray={crntPost?.images_url || []} toggle={setToggel} />
                        </Suspense>
                    </div>
                   <div className={`${isFull ? "w-0!" : "flex-1"} transition-all duration-200 flex items-center justify-center h-full`}>
                        <btnContext.Provider value={{setToggel, paramPost:pID}}>
                            <Suspense fallback={null}>
                                <SheetMiddleWhare/>
                            </Suspense>
                        </btnContext.Provider>
                    </div>
                </div>
            </div>
    )
}