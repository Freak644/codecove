export default function PostsCon({posts,fetch}) {
    
    return(
        <div className="h-full w-full flex items-start flex-row">
            <div className="leftPart flex-2 flex items-center p-5 flex-col gap-4">
                <div className="activst w-full flex justify-center items-center gap-2.5">

                </div>
                {
                    posts.map(({caption,comment,imgages_url,saveop,post_id})=>{

                    })
                }
            </div>
        </div>
    )
}