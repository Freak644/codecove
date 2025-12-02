import ImageSlider from "../Promulgation/sliderCom"

export default function PostsCon({posts,fetch}) {
    
    return(
        
            <div className="pl-[8vw] pr-[8vw] h-full flex items-center justify-center p-5 flex-wrap border-amber-500 border-2 my-scroll gap-6 ">
                {
                    posts.map(({caption,caComment,images_url,canSave,post_id,username,avatar})=>{
                        return(
                            <div key={post_id} className="flex items-start flex-col border border-amber-200 h-5/6 gap-3 w-[400px] singlePost">
                                <div className="ownInfo h-1/5 flex items-center flex-row p-1 gap-1.5 text-skin-text w-full border border-b-blue-800">
                                    <div className="innerINFODiv p-1 flex items-start flex-1">
                                        <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full" alt="Avatar" />
                                        <p>{username}</p>
                                    </div>
                                    <div className="innerINFODiv flex-1 flex items-center justify-end relative!">
                                        <i className='bx bx-dots-vertical-rounded'></i>
                                    </div>
                                </div>
                                <div className="imgContainer w-full h-3/5 flex items-center">
                                     <ImageSlider imgArray={images_url} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        
    )
}