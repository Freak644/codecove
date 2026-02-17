export default function ProgressBar({date,postData}) {
    let {waiting,progress} = date;
    console.log(postData)
    return(
        <>
            { waiting ? 
                <div className="miniLoader h-30! w-30!"></div> :
                progress > 0 && <div className="wrapper h-40 w-40 rounded-full relative overflow-hidden border border-skin-ptext/50">
                        <div style={{
                                    background: `conic-gradient(#00be0a ${progress * 3.6}deg,#ffffff ${progress * 3.6}deg)`
                                }} className={` h-full w-full rounded-full flex items-center justify-center animate-pulse transition-all duration-700`}>
                            <div className="numberDiv h-9/10 w-9/10 rounded-full bg-skin-bg flex items-center justify-center">
                                <p className="text-skin-text">{`${progress}%`}</p>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}