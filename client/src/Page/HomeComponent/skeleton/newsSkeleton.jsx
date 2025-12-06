export default function NewsSkel() {
    
    return(
        <div className="underTaker border border-rose-500 my-scroll gap-2!">
            {
                [1,2,3,4,5,6,7,8].map(news=>{
                   
                    return(
                        <div key={news} className="newsDiv flex items-center  h-40  flex-row relative w-full p-2 overflow-hidden gap-2">
                            <div className=" h-full w-full bg-gray-500 animate-pulse">
                              
                            </div>
                            <p className="text-wrap text-white  transition-all bg-gray-500 animate-pulse duration-700 p-4  h-10 w-4/5"></p>
                        </div>
                    )
                })
            }
        </div>
    )
}