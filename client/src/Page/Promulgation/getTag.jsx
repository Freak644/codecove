import { useEffect, useState } from "react"

export default function GetTag ({setTab}) {
    const [tags,setTags] = useState([]);
    const [isCalling,setCalling] = useState(false);
    return(
        <div className="h-9/10 border border-gray-800 bg-violet-950/2 p-2! w-full flex items-center flex-col rounded-lg">
                <div className="headingContainer h-1/4   w-full text-skin-text">
                    <p><span className="text-purple-700">#</span> Tags</p>
                    
                </div>
                <div className="h-1/2 w-full  text-skin-text p-1 pl-1 pr-2.5 flex items-start gap-5">
                    <input type="text" placeholder="# Type to get..."  className="border pl-2.5 border-purple-500/40 rounded-md w-1/2 "/>
                    <button className="p-1 bg-violet-900/30 rounded-md">{isCalling ? <div className="miniLoader"/>: "Find"}</button>
                </div>
                <div className="tags h-1/2  w-full flex items-center flex-row gap-2.5 p-1.5">
                    {
                       tags.length===0 ? <p className="miniLoader"></p> : tags.map((obj,index) => (
                            <div key={index}>
                                <span className="text-purple-700">#</span>
                                    {obj.tag_name}
                            </div>
                        ))
                    }
                </div>
        </div>
    )
}