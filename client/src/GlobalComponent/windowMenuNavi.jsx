import { useEffect, useState } from "react"
import { CodeBlockI, MeneHI } from "../utils/SVG/menuSVG";
import { GradientSVG } from "../utils/getSVG";
import { FaLaptopCode } from "react-icons/fa";

export default function WindowsMenu () {
    const [crntTab, setTab] = useState('Home');
    const [isHidden, setHidden] = useState(false);

    useEffect(()=>{
            let routeContainer = document.querySelector('.routeContainer')
            let menuDiv = document.querySelector('.menuDiv')
            if (!routeContainer ||
                !menuDiv
            ) {
                return
            }
            if (isHidden) {
                routeContainer.classList.add('hideMenu');
                menuDiv.classList.add('hideMenu')
            }else{
                routeContainer.classList.remove('hideMenu');
                menuDiv.classList.remove('hideMenu')
            }
        },[isHidden])

    return(
        <>
            <p id="secBtn" onClick={()=> {setHidden(prev=>!prev),pipFun()}} className="h-8 w-8 flex logotxt items-center justify-center text-2xl cursor-pointer
            border-skin-ptext/30 border rounded-full absolute top-3 -right-2">
                <MeneHI customStyle={`text-skin-ptext ${isHidden && "rotate-180"}`}/>
            </p>
            <div className="topIconDiv flex items-center justify-center gap-1.5">
                <div className="Logotxt">
                    <GradientSVG id={"menu"} />
                    <CodeBlockI customStyle="h-8 w-10" style={{fill: "url(#menu)"}}  />
                </div>
                <div className="textMD text-skin-text mt-2">
                    <p>EchoVain's</p>
                    <p className="text-skin-ptext text-[8px]">Code. Connect. Create.</p>
                </div>
            </div>
        </>
    )
}