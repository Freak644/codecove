import {getColor} from './getGradnt';
export default function LogoCom() {
    let gradColor = getColor();
    return(
        <div className="Logotxt flex items-center flex-col w-[120px]">
            <i className={`bx bx-code-block text-5xl
            transition-all duration-500 ease-in-out bg-size-[200%_200%]
            bg-linear-to-tr ${gradColor}
            bg-clip-text text-transparent
            `}></i>
            <h2 className={`font-bold text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
            bg-linear-to-tr ${gradColor}
            bg-clip-text text-transparent`}>CodeCove</h2>
        </div>
    )
}