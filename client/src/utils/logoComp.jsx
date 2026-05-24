import {getColor} from './getGradnt';
import {FaLaptopCode} from 'react-icons/fa'
import { GradientSVG } from './getSVG';
export default function LogoCom({CustomclassName}) {
    let gradColor = getColor();
    return(
        <div className={`Logotxt flex items-center flex-col w-30 ${CustomclassName || ""}`}>
            <GradientSVG id={"grad"}/>
            <FaLaptopCode
            style={{fill:"url(#grad)"}}
             className={`text-5xl `}
            />
         
            <div className="nameHoler gap-1 flex items-center flex-row">
                <h2 className='font-bold text-3xl transition-all duration-300 ease-in-out
                bg-linear-to-b from-blue-300 to-blue-600 bg-clip-text text-transparent'>ECHO</h2>
                <h2 className={`font-bold text-3xl transition-all duration-500 ease-in-out 
                bg-linear-to-b from-yellow-300 from-25%  via-pink-500 via-60% to-purple-500 to-75%
                bg-clip-text text-transparent`}>VAIN</h2>
            </div>
        </div>
    )
}