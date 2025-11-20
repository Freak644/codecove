import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import { toggleABMenu,useThemeStore } from "../../lib/toggleTheme";
export default function WindowHerder() {
    let location = useLocation();
    let [pathName,setPath] = useState("");
    let [userData,setData] = useState({});
    const crntTheme = useThemeStore(state=>state.theme)
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);
    let {userInfo} = UnivuUserInfo();
    useEffect(()=>{
        setData(userInfo)
    },[userInfo])
    useEffect(()=>{
        switch (location.pathname) {
            case "/":
                setPath("Dashbord")
                break;
            default:
                let path = location.pathname.split("/")
                setPath(path[1])
                break;
        }
    },[location.pathname])

    const getColor = () => {
        switch (crntTheme) {
            case "dark-white" : return "from-purple-500 via-pink-500 to-blue-600";
            case "dark-yellow" : return "from-purple-500 via-yellow-500 to-blue-600";
            default: return "from-fuchsia-700  via-rose-500 to-purple-500";
        }
    }

    return(
        <div className="mainheaderCom relative w-screen h-[50px] flex items-center justify-between p-1 
            border-amber-200 border-b border-b-gray-500 bg-blue-800/10 backdrop-blur-lg
        ">
            
            <div className="leftHeader text-4xl flex flex-1 gap-4 pl-5">
                <div onClick={()=>toggleMenu(!isMenuToggling)} className="h-10 menuBTN cursor-pointer w-10 flex logotxt items-center justify-center text-3xl border-skin-ptext/30 border rounded-full"><i className="bx bx-menu text-skin-ptext"></i></div>
                <i className={`bx bx-code-block transition-all duration-500
                ease-in-out bg-size-[200%_200%] bg-linear-to-tr ${getColor()}
                bg-clip-text text-transparent
                `}></i>
                <span className="text-skin-ptext text-[15px]  flex items-center">{pathName}</span>
            </div>
            
            <div className="rightHeader flex justify-end flex-1 text-skin-text ">
                <form action="" className="flex relative items-center justify-start gap-1 p-2  border-skin-ptext/30">
                    <input type="text" placeholder="Type to search" className="p-1 pl-8 border-2 placeholder:text-skin-ptext/50 transition-all duration-1000 rounded-sm border-skin-ptext/30
                    w-64
                    " />
                    <i className={`absolute left-2.5 bx bx-code-block transition-all duration-500
                ease-in-out bg-size-[200%_200%] bg-linear-to-tr ${getColor()} 
                bg-clip-text text-transparent text-2xl
                `}></i>
                    <div className=" cursor-pointer miniMenuDiv m-2 text-2xl border-2 border-skin-ptext/30 rounded-lg flex items-center justify-center">
                        <i className="bx bx-ghost m-1 border-r"></i>
                        <i className='bx bx-chevron-down text-[18px]'></i>
                    </div>
                </form>

                <div className="secminiMenuDiv text-2xl flex items-center flex-row gap-[1vw] ">
                    <div className="createPost flex items-center justify-center ml-2.5 border-2 border-skin-ptext/40 rounded-lg
                    cursor-pointer ">
                        <i className="bx bx-plus border-r m-1"></i>
                        <i className="bx bx-chevron-down text-[18px]"></i>
                    </div>

                    <div className="userThings flex gap-[1vw]">
                        <i title="Report an issue" className="bx bx-info-circle border border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></i>
                        <i title="Source Code"  onClick={()=>window.open("https://github.com/Freak644","_blank")} className="bx bxl-github border border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></i>
                        <i title="Notification" className="bx bx-bell border border-skin-ptext/30 p-1 rounded-lg cursor-pointer"></i>
                        <div title={userData.username || "Loading"} className="h-9 w-9 overflow-hidden cursor-pointer border rounded-full flex items-center justify-center relative">
                            <img className="h-full" src={userData.avatar ? `/myServer/${userData.avatar}` : "https://i.postimg.cc/7ZTJzX5X/icon.png"} alt="" />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}