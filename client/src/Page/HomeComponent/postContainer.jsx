import ImageSlider from "../Promulgation/sliderCom"

export default function PostsCon({posts,fetch}) {
    
    return(
        
            <div className="pl-[8vw] pr-[8vw] h-full flex items-center justify-center p-5 flex-wrap border-amber-500 border-2 my-scroll gap-6">
                {
                    posts.map(({caption,caComment,images_url,canSave,post_id,username,avatar})=>{
                        return(
                            <div key={post_id} className="flex items-start flex-col border border-amber-200 h-5/6 gap-3 w-[450px] singlePost rounded-lg">
                                <div className="ownInfo h-1/10 flex items-center flex-row p-1 gap-1.5 text-skin-text w-full border border-b-blue-800 rounded-lg">
                                    <div className="innerINFODiv p-1 flex items-start flex-1 gap-2.5">
                                        <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full border border-amber-300" alt="Avatar" />
                                        <p className="text-lg">{username}</p>
                                    </div>
                                    <div className="innerINFODiv flex-1 flex items-center justify-end relative!">
                                        <i className='bx bx-dots-vertical-rounded'></i>
                                    </div>
                                </div>
                                <div className="imgContainer w-full h-4/5 flex items-center border border-b-emerald-600">
                                     <ImageSlider imgArray={images_url} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        
    )
}