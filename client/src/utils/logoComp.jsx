import {getColor} from './getGradnt';
export default function LogoCom({CustomclassName}) {
    let gradColor = getColor();
    return(
        <div className={`Logotxt flex items-center flex-col w-30 ${CustomclassName || ""}`}>
            <i className={`bx bx-code-alt text-5xl
            transition-all duration-500 ease-in-out bg-size-[200%_200%]
            bg-linear-to-tr ${gradColor}
            bg-clip-text text-transparent
            `}></i>
            <div className="nameHoler flex items-center flex-row">
                <h2 className='font-bold text-3xl transition-all duration-300 ease-in-out
                bg-linear-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent'>Null</h2>
                <h2 className={`font-bold text-3xl transition-all duration-500 ease-in-out 
                bg-linear-to-b from-yellow-300 from-40% via-pink-500 to-purple-500
                bg-clip-text text-transparent`}>Vain</h2>
            </div>
        </div>
    )
}