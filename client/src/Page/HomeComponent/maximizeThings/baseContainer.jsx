import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "../../Promulgation/sliderCom";
import { useEffect } from "react";

export default function MaximizeContainer() {
    let {pID} = useParams();
    let navi = useNavigate();

    const getCrntPost = async (postID) => {
        try {
            let rqst = await fetch('/mySever/')
        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getCrntPost(pID)
    },[pID]);

    return(
            <div className="underTaker">
                <div className="closeBtn flex items-center justify-center p-3 rounded-full text-2xl font-bold text-skin-ptext absolute top-5 right-2">
                    <button 
                        onClick={()=>navi(-1)}
                    >
                        X
                    </button>
                </div>
                <div className="h-4/5 w-4/6 rounded-lg p-2 flex items-center justify-center flex-wrap border border-white">
                    <div className="flex-1 flex items-center justify-center border border-green-500 h-full">
                   
                    </div>
                    <div className="flex-1 flex items-center justify-center border border-purple-500 h-full"></div>
                </div>
            </div>
    )
}