export default function ExplorSkel() {
    
    return(
        <div className="underTaker my-scroll gap-4">
            <div className="h-full p-1 w-4/5 grid grid-cols-5 gap-2">
                {
                    [...Array(30)].map((_,i)=>(
                        <div key={i} className="bg-gray-500 rounded-md animate-pulse aspect-square">

                        </div>
                    ))
                }
            </div>
            
            <div className="w-1/5 p-2 gap-2 h-full flex items-center flex-col">
                {
                    [...Array(20)].map((_,i)=>(
                        <div key={i} className="h-12 w-full flex items-center justify-around">
                            <div className="circle bg-gray-500 animate-pulse h-12 w-12 rounded-full"></div>
                            <p className="h-2.5 bg-gray-500 animate-pulse w-20"></p>
                            <p className="h-6 bg-gray-500 animate-pulse w-15 rounded-md"></p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}