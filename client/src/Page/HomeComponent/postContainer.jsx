export default function PostsCon({posts,fetch}) {
    
    return(
        <div className="h-full w-full flex items-start flex-row">
            <div className="leftPart flex-2 flex items-center p-5 flex-col gap-4">
                <div className="activst w-full flex justify-center items-center gap-2.5">

                </div>
                {
                    posts.map(({caption,comment,imgages_url,saveop,post_id,username,avatar})=>{
                        return(
                            <div key={post_id} className="flex items-center flex-col gap-2">
                                <div className="ownInfo flex items-center flex-row p-1 gap-1.5 text-skin-text">
                                    <img src={`/myServer/${avatar}`} className="h-9 w-9 rounded-full" alt="Avatar" />
                                    <p>{username}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}