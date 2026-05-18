import { useMemo } from "react";
import { BookmarkHeartIcon, BookmarkIcon } from "../../../../utils/SVG/SVG";
import { debouncerGlob } from "../../../../utils/debounceFun";
import axios from "axios";
import { univPostStore } from "../../../../lib/basicUserinfo";
import { toast } from "react-toastify";

export default function SvCom({Data}) {
    let {canSave, post_id, isFollowing, totalSave, isSaved} = Data || {};
    let {setUnivPost} = univPostStore();
    const handleSaveStatus = (newInfo, totalSave) => {
        console.log(newInfo, totalSave)
        setUnivPost({
            [post_id]:{
                totalSave: newInfo ? totalSave + 1 : totalSave - 1,
                isSaved:newInfo
            }
        });
        
    }

    const handleSave = async (pst_id,save,follow, totalSave) =>{
        let newInfo = !isSaved
       
        
        try {
            handleSaveStatus(newInfo, totalSave)
          if (!save) throw new Error("Saving turned off by user");
          if (save !== "Everyone" && !follow) throw new Error("Restricted");
          if (pst_id.length !== 21) throw new Error("Post id is not valid");
          
            await axios.post("/myServer/writePost/savePost",
            {pst_id}
          )

        } catch (error) {
            if (error.response) {
                toast.warning(error.response.data.err);
            }else{
                toast.error(error.message);
            }
        }
    }

    
    const saveDebouce = useMemo(()=> {
        return debouncerGlob(handleSave);   
    },[]); 

    return(
        <div onClick={()=>saveDebouce(post_id, canSave,isFollowing, totalSave)} className={`underTaker}`}>
            {isSaved ? <BookmarkHeartIcon className={`svgicon`}/> : <BookmarkIcon className={`svgicon`} />}
        </div>
    )
}