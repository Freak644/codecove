import { useEffect, useMemo, useState } from "react"
import { usePostStore } from "../../lib/basicUserinfo";
import { toast } from "react-toastify";
import axios from "axios";
import { debouncerGlob } from "../../utils/debounceFun";

export default function GetTag ({setTab}) {
    const [tags,setTags] = useState([]);
    const [isCalling,setCalling] = useState(false);
    const selectedTags = usePostStore(stat=> stat.postOBJ.tags) || [];
    const {setPostOBJ} = usePostStore();
    
    const handleSelecting =  (index) => {
        let {tag_name, tag_id} = tags[index];
        let isTaken = selectedTags.some(obj=> obj.tag_name === tag_name);

        if (isTaken) {
            toast.info(`#${tag_name} is Already selected`);
        }else {
            let updateArray = [...new Set([...selectedTags, {tag_name,tag_id}])];
            setPostOBJ({tags:updateArray});
        }
    }

    const handleInputs = async (inp) => {
        console.log(inp);
        if (inp.length < 3) return;
        setCalling(true)
        try {
            let resp = await axios.post("/myServer/readPost/getTags",{
                tagName:inp
            },{
                headers:{
                    "Content-Type":"application/json"
                },
            });

            let matchingTags = resp.data?.tags
            console.log(matchingTags);
            if (resp.data?.tags.length > 0) {
                setTags(matchingTags)
            } else if (resp.data.err) {
                throw new Error("Something went wrong");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setCalling(false);
        }
    }

    const getTags = useMemo(()=> {
        return debouncerGlob(handleInputs);
    });

    const getRecent = async () => {
        try {
            let resp = await axios.post("/myServer/readPost/getRecent_tag");
            if (resp.data.pass) {
                setTags(resp.data.recentTags_id);
            }

        } catch (error) {
            toast.error(error?.response?.data.err || error.message)
        }
    }

    useEffect(()=> {

    },[])
    return(
        <div className="h-9/10 border border-gray-800 bg-violet-950/2 p-2! w-full flex items-center flex-col rounded-lg relative">
                <div className="headingContainer h-1/4   w-full text-skin-text">
                    <p><span className="text-purple-700">#</span> Tags</p>
                    
                </div>
                <div className="h-1/2 w-full  text-skin-text p-1 pl-1 pr-2.5 flex items-start gap-5">
                    <input onKeyUp={(evnt)=>getTags(evnt.target.value)} type="text" placeholder="# Type to get..."  className="border pl-2.5 border-purple-500/40 rounded-md w-1/2 "/>
                    <button className="p-1 bg-violet-900/30 rounded-md HoverMe" onClick={()=>setTab(false)}>{isCalling ? <div className="miniLoader"/>: "Go back"}</button>
                </div>
                <div className="tags h-1/3 w-[35vw] gap-2.5 p-1.5 flex items-center flex-row my-scroll-x absolute left-1 bottom-2">
                    {
                       tags.length===0 ? <p className="miniLoader"></p> : tags.map((obj,index) => (
                            <div key={index} onClick={()=>handleSelecting(index)} className="shrink-0 tagsHolder HoverMe flex items-center justify-center text-skin-text">
                                <span className="text-purple-700">#</span>
                                    {obj.tag_name}
                            </div>
                        ))
                    }
                </div>
        </div>
    )
}