export default function HomeSkeleton() {
    
    return(
        <div className="h-full w-full flex items-start flex-row">
            <div className="leftPart flex-2 flex items-center p-5 flex-col gap-4">
                <div className="activst w-full flex justify-center items-center gap-2.5">
                    {   [1,2,3,4,5].map(index=>{
                        return(<div key={index} className="flex items-center justify-center gap-2.5">
                                    <div className="taker flex items-center justify-center gap-2.5">
                                    <div className="circle h-20 w-20 rounded-full bg-gray-500 animate-pulse"></div>
                            </div>
                        </div>)
                    })

                }
                </div>
                {
                    [1,2,3,4].map(index=>{
                        return(<div key={index} className="flex items-start flex-col gap-2">
                                <div className="ownInfo w-40 h-5 rounded-lg bg-gray-500 animate-pulse"></div>
                                <div className="imgCOn w-[420px] h-[400px] bg-gray-500 animate-pulse rounded-lg"></div>
                                <div className="caption flex items-center w-26 justify-start flex-wrap gap-2">
                                    <p className="w-25 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                    <p className="w-22 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                    <p className="w-20 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                </div>
                        </div>)
                    })
                }
            </div> 
            <div className="rightPart flex-1 flex items-center p-5 flex-col gap-2.5">
                {
                    [1,2,3,4].map(index=>{
                        return(<div key={index} className="flex items-center flex-col gap-2.5">
                                    <div className="taker flex items-center justify-center gap-2.5">
                                    <div className="circle h-15 w-15 rounded-full bg-gray-500 animate-pulse"></div>
                                <div className="txt h-15 w-30 rounded-2xl bg-gray-500 animate-pulse"></div>
                            </div>
                        </div>)
                    })
                }
            </div>
        </div>
    )
}