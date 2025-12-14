import { useNavigate, useParams } from "react-router-dom";

export default function MaximizeContainer() {
    let {pID} = useParams();
    let navi = useNavigate();

    return(
            <div className="underTaker">
                <div className="closeBtn flex items-center justify-center p-3 rounded-full text-2xl font-bold text-skin-ptext absolute top-5 right-2">
                    <button 
                        onClick={()=>navi(-1)}
                    >
                        X
                    </button>
                </div>
                
            </div>
    )
}