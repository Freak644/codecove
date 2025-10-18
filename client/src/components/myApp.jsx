import PageTransition from '../assets/animations/framerMotion'
import {Routes,Route, useLocation} from 'react-router-dom';
import LoginEL from '../Page/Login/baseFIle';
import Header from '../Page/BaseComponent/header';
import MenuEL from '../Page/BaseComponent/menu';
import { useEffect, useState } from 'react';
import { Loader } from '../lib/loader';
import LoaderEL from '../assets/animations/loadingBar';
import { mngCrop, useThemeStore } from '../lib/toggleTheme';
import CropperEL from './cropperEL';
export default function MyApp() {
    let {fileURL} = mngCrop();
    let [isCropping,setCropping] = useState(false);
    let {toggleTheme} = useThemeStore();
    let [currentTheme] = useState(localStorage.getItem('theme') || "dark")
    let location = useLocation();
    let [isLogin,setLogin] = useState(true);
    const {isTrue,toggleLoader} = Loader();
    const [isLoader,setLoader] = useState(isTrue);
    useEffect(()=>{
        const handler = ()=> toggleLoader();
        window.addEventListener("load",handler);
        return ()=> window.removeEventListener("load",handler)
    },[location.pathname]);
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
        setLoader(isTrue)
    },[isTrue])

    useEffect(()=>{
        if (fileURL?.length>1) {
            setCropping(true)
        }else{
            setCropping(false)
        }
    },[fileURL])
    return(
        <PageTransition location={location} key={location.pathname}>
            {isLoader && <LoaderEL/>}
           {!isLogin && <Header/>}
           {!isLogin && <MenuEL/>}
           {isCropping && <CropperEL prevImg={fileURL} />}
           {isLogin && <div className='loginContainer flex items-center content-center h-[100vh] w-[100vw]'>{<LoginEL/>}</div>}
            <Routes>
                {/* <Route path='/' element={} /> */}
                <Route path='/' element={<div className='routeContainer flex items-center content-center'></div>} />
            </Routes>
        </PageTransition>
    )
}