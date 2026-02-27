import { useEffect, useRef, useState } from "react";
import { toggleABMenu } from "../lib/toggleTheme";
import { Link } from "react-router-dom";
import {getColor} from '../utils/getGradnt';
import ExploreEL from "../utils/ExploreCom";
import ThemeButton from "../components/toggleButton";
export default function AbsoluteMenu() {
    let mainRef = useRef();
    const isMenuToggling = toggleABMenu(state => state.isMenuToggling);
    const toggleMenu = toggleABMenu(state => state.toggleMenu);
    const [isDD,setDD] = useState(true)
    useEffect(() => {
        const menuDiv = document.querySelector(".absoluteMenu");
        if (!menuDiv) return;

        if (isMenuToggling) {
            menuDiv.classList.add("activeAbMenu");
        } else {
            menuDiv.classList.remove("activeAbMenu");
        }
    }, [isMenuToggling]);

    const handleLogout = async () => {
        let rqst = await fetch("/myServer/Logout",{
            headers:{
                "Content-Type":"application/json"
            },
            method:"POST",
        })
        let result = await rqst.json();
        console.log(result)
        if (result.pass) {
           location.reload()
            navi('/')            
        }
    }

    useEffect(() => {
        const handleClick = (evnt) => {
            let tmpArray = [];
         let menuBTNS = document.querySelectorAll(".menuBTN")
            if (!menuBTNS) return;
            menuBTNS.forEach(btn=>{
                if (btn.contains(evnt.target)) {
                    tmpArray.push(btn)
                }
            })
            if (
                isMenuToggling &&
                mainRef.current &&
                !mainRef.current.contains(evnt.target) &&
                tmpArray.length === 0
            ) {
                toggleMenu(false);
            }
        };

        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [isMenuToggling]);

    return(
        <div ref={mainRef} className="absoluteMenu z-99  absolute flex top-[9vh] h-[90vh] items-center justify-center flex-wrap
        p-4 -left-87.5 opacity-0 transition-all duration-500 bg-blue-800/5 backdrop-blur-lg w-3xs">
             <div className="Logotxt sticky top-0 flex items-center mt-3.5! flex-col w-30">
                <i className={`bx bx-code-block text-5xl
                transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${getColor()}
                bg-clip-text text-transparent
                `}></i>
                <h2 className={`font-bold! text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${getColor()}
                bg-clip-text text-transparent`}>CodeCove</h2>
            </div>
            <div className="AbMenuDiv my-scroll w-full h-4/5 my-scroll 
            flex items-center flex-col text-md text-skin-text">
                <ul className="w-full p-4 flex items-start justify-center flex-wrap gap-2">
                    <li>
                        <Link to="/DashBord">
                        <i className="bx bxs-dashboard"></i>
                        <span>Dashbord</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Commit">
                        <i className={`bx bxs-plus-circle text-skin-text`}></i>
                        <span>Commit</span>
                        </Link>
                    </li>

                    <li className="justify-start! flex-wrap">
                        <i onClick={()=>setDD(prev=>!prev)}  className={`bx bxs-compass text-skin-text cursor-pointer`}></i>
                        <span onClick={()=>setDD(prev=>!prev)} className='flex items-center cursor-pointer'>Explore<i className={`bx bx-chevron-${isDD?"down":"right"} mt-0.5`}></i></span>
                        {isDD && <ExploreEL/>}
                    </li>

                    <li>
                        <Link to="" title="Profile" >
                            <i>🧑‍💻</i>
                            <span>My Lab</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="" title="Login Activity" >
                            <i>📈</i>
                            <span>Your Sessions</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="Account">
                            <i>🧑‍💻</i>
                            <span>Mgmt Account</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="Dev Tools">
                            <i>🔫</i>
                            <span>Tools</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="">
                            <i>🔖</i>
                            <span>Saved</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="Achievements">
                            <i>🏆</i>
                            <span>Achievements</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="">
                            <i>⚙️</i>
                            <span>Setting</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="">
                            <i>📝</i>
                            <span>Tasks</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="">
                            <i>🧱</i>
                            <span>Communities</span>
                        </Link>
                    </li>

                    <li>
                        <ThemeButton/>
                    </li>

                    <li>
                        <Link to="" title="Source Code">
                            <i className="bx bxl-github"></i>
                            <span>Source Code</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="" title="Repor a Issue">
                            <i>ℹ️</i>
                            <span>Issue</span>
                        </Link>
                    </li>
                    <li onClick={handleLogout}>
                            <i>👤</i>
                            <span>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}