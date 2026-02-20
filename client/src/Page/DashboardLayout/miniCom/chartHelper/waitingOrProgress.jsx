export default function ProgressBar({date}) {
    let {waiting,progress} = date;
    return(
        <>
            { waiting ? 
                <div className="miniLoader h-30! w-30!"></div> :
               ""
            }
        </>
    )
}