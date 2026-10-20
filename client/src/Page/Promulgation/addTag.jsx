export default function AddTag () {
    const tempTags = [
        {"tag":"Node"},
        {"tag":"MYsql"},
        {"tag": "Python"}
    ]
    return(
        <div className="h-4/10 rounded-lg gap-2 w-full relative">
            <div className="absolute text-skin-ptext right-2.5 top-1.5">
                3/5
            </div>
            <div className="h-9/10 border border-gray-800 bg-violet-950/2 p-2! w-full flex items-center flex-col rounded-lg">
                <div className="headingContainer h-1/2  w-full text-skin-text">
                    <p><span className="text-purple-700">#</span> Tags</p>
                    <span className="text-skin-ptext/80 text-[13px]">You can add 5 tags to help ohters discover your post</span>
                </div>

                <div className="tags h-1/2  w-full flex items-center flex-row gap-2.5 p-1.5">
                    {
                        tempTags.map((obj,index)=>(
                            <div key={index} className="miniTagDiv HoverMe text-skin-text hover:text-purple-700 bg-violet-800/10 rounded-lg cursor-pointer text-[13px] p-2 border border-violet-700/50">
                                <span className="text-purple-700">#</span>{obj.tag}
                            </div>
                        ))
                    }
                    <div className="miniTagDiv HoverMe text-skin-text hover:text-gray-700 rounded-lg cursor-pointer text-[13px] p-2 border border-dashed border-gray-600/50">
                        <span className="text-gray-600">+ Add tag</span>
                    </div>
                </div>
            </div>
        </div>
    )
}