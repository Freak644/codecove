export default function WindowHerder(params) {
    
    return(
        <div className="mainheaderCom relative w-[100vw] h-[50px] flex items-center justify-between p-1 
            border-amber-200 
        ">
            <div className="leftHeader text-4xl flex flex-1 gap-5 !pl-5">
                <i className="bx bx-menu text-skin-ptext"></i>
                <i className="bx bx-code-block transition-all duration-500
                ease-in-out bg[length:200%_200%] bg-gradient-to-br from-purple-500 via-pink-400 to-blue-600 
                bg-clip-text text-transparent
                "></i>
            </div>
            <div className="rightHeader flex-1 text-white">
                    john
            </div>
            
        </div>
    )
}