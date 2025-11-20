import PageTransition from '../assets/animations/framerMotion'
import {Routes,Route, useLocation, useNavigate} from 'react-router-dom';
import LoginEL from '../Page/Login/baseFIle';
import Header from '../Page/BaseComponent/header';
import MenuEL from '../Page/BaseComponent/menu';
import { useEffect, useState } from 'react';
import { Loader } from '../lib/loader';
import LoaderEL from '../assets/animations/loadingBar';
import { mngCrop, useThemeStore } from '../lib/toggleTheme';
import CropperEL from './cropperEL';
import WindowHerder from '../Page/BaseComponent/windowHeader';
import CheckInfo from '../Page/Login/checkinfo';
import NotFound from '../Page/BaseComponent/404NotFound';
import '../assets/style/paseTwo.css'
import DragDropBox from '../Page/Promulgation/dropBox';
import HomePage from '../Page/HomeComponent/HomePage'
import AbsoluteMenu from './absoluteMenu';
export default function MyApp() {
    let {fileURL} = mngCrop();
    let [isCropping,setCropping] = useState(false);
    let {toggleTheme} = useThemeStore();
    let [currentTheme] = useState(localStorage.getItem('theme') || "dark-white")
    let currentLocation = useLocation();
    let [isLogin,setLogin] = useState(true);
    const [winddowHerder,setHeader] = useState(true);
    const {isTrue,toggleLoader} = Loader();
    const [isChecking,setCheck] = useState(false)
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
    useEffect(()=>{
        if (window.innerWidth > 1023) {
            setHeader(true)
        }else{
            setHeader(false)
        }
    },[])
    useEffect(()=>{
        let currentPath = currentLocation.pathname.split("/")
        if (currentPath[1] === "checkInfo") {
            setCheck(true)
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
                console.log(result?.details)
                if (result.loggedIn) {
                    throw new Error(result.details)
                }
                setLogin(false)
            } catch (error) {
                console.log(error.message)
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
        <PageTransition location={currentLocation} key={currentLocation.pathname}>
            {isTrue && <LoaderEL/>}
            {winddowHerder && !isLogin && <WindowHerder/>}
           {!isLogin && <Header/>}
           {!isLogin && <MenuEL/>}
           {isCropping && <CropperEL prevImg={fileURL} />}
           <AbsoluteMenu/>
           {(isLogin && !isChecking) && (<div className='loginContainer flex items-center content-center h-screen w-screen'>{<LoginEL/>}</div>)}
            {(!isLogin || isChecking) && (<Routes>
                <Route path='/' element={<div className='routeContainer my-scroll'><HomePage/></div>} />
                <Route path='/CheckInfo/:session_id' element={<div className='my-scroll flex items-center justify-center h-screen w-screen'>{<CheckInfo/>}</div>} />
                <Route path='/Create' element={<div className='routeContainer my-scroll'><DragDropBox/></div>} />

                <Route path='*' element={<NotFound/>} />
            </Routes>)}
        </PageTransition>
    )
}

/*
 Humpty Dumpty sat on a wall, /Humpty Dumpty had a great fall.
 /All the king's horses and all the king's men/
 Couldn't put Humpty together again.
*/