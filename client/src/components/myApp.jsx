import { useLocation} from 'react-router-dom';
import LoginEL from '../Page/Auth/baseFIle';
import Header from '../GlobalComponent/header';
import MenuEL from '../GlobalComponent/menu';
import { useEffect, useState } from 'react';
import { Loader } from '../lib/loader';
import LoaderEL from '../assets/animations/loadingBar';
import { mngCrop, useThemeStore } from '../lib/toggleTheme';
import CropperEL from './cropperEL';
import WindowHerder from '../GlobalComponent/windowHeader';
import '../assets/style/paseTwo.css'
import AbsoluteMenu from '../GlobalComponent/absoluteMenu';
import AnimateRoute from './Routes/AnimateRoute';
import NoAnimRoutes from './Routes/noAnimationRoute';
import socket from '../utils/socket';
import { UnivuUserInfo } from '../lib/basicUserinfo';
export default function MyApp() {
    let {fileURL} = mngCrop();
    let [isCropping,setCropping] = useState(false);
    let {toggleTheme} = useThemeStore();
    let [currentTheme] = useState(localStorage.getItem('theme') || "dark-white")
    let currentLocation = useLocation();
    let [isLogin,setLogin] = useState(true);
    const [winddowHerder,setHeader] = useState(true);
    const {isTrue,toggleLoader} = Loader();
    const [isChecking,setCheck] = useState(false);
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    useEffect(() => {
        const setVH = () => {
            const vh = window.visualViewport?.height
            ? window.visualViewport.height * 0.01
            : window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        setVH();
        window.visualViewport?.addEventListener('resize', setVH);
        window.addEventListener('resize', setVH);
        return () => {
            window.visualViewport?.removeEventListener('resize', setVH);
            window.removeEventListener('resize', setVH);
        };
        }, []);

        useEffect(() => {
            if (!uID) return;
            socket.auth = {user_id:uID}
            socket.connect();

            socket.on("connect", () => {
                console.log("Connected →", socket.id);
            });

            socket.on("disconnect", () => {
                console.log("Disconnected");
            });

            return () => {
                socket.disconnect();
            };
        }, [uID]);

    useEffect(()=>{
        if (window.innerWidth > 1023) {
            setHeader(true)
        }else{
            setHeader(false)
        }
    },[])
    useEffect(()=>{
        let currentPath = currentLocation.pathname.split("/")
        if (currentPath[1] === "checkInfo" || currentPath[1] === "resetPassword") {
            setCheck(true)
        }else{
            setCheck(false)
        }
        const handler = ()=> toggleLoader(false);
        if (document.readyState === "complete") {
            handler();
        }else{
            window.addEventListener("load",handler);
        }
        return ()=> window.removeEventListener("load",handler)
    },[currentLocation.pathname]);
    useEffect(()=>{
        toggleTheme(currentTheme)
        const checkAuth = async () => { 
            try {
                let rqst = await fetch("/myServer/auth",{credentials:"include"})
                let result = await rqst.json();
                // console.log(result?.details)
                if (result.loggedIn) {
                    throw new Error(result.details)
                }
                setLogin(false)
            } catch (error) {
                // console.log(error.message)
                setLogin(true)
            }
        }
        checkAuth();
    },[])

    useEffect(()=>{
        if (fileURL?.length>1) {
            setCropping(true)
        }else{
            setCropping(false)
        }
    },[fileURL]);

    return(
        <>
            {isTrue && <LoaderEL/>}
            {(winddowHerder && !isLogin && !isChecking) && <WindowHerder/>}
           {(!isLogin && !isChecking) && <Header/>}
           {(!isLogin && !isChecking) && <MenuEL/>}
           {isCropping && <CropperEL prevImg={fileURL} />}
           <AbsoluteMenu/>
           {(isLogin && !isChecking) && (<div className='loginContainer flex items-center content-center h-screen w-screen'>{<LoginEL/>}</div>)}

            {(!isLogin || isChecking) && (
                isChecking ? <NoAnimRoutes/> : <AnimateRoute location={currentLocation} />
            )}

         </>
    )
}

/*
 Humpty Dumpty sat on a wall, /Humpty Dumpty had a great fall.
 /All the king's horses and all the king's men/
 Couldn't put Humpty together again.
*/