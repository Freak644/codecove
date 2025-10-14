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
    let {fileURL,setURL} = mngCrop();
    let [isCropping,setCropping] = useState(false);
    let {toggleTheme} = useThemeStore();
    let [currentTheme] = useState(localStorage.getItem('theme') || "light")
    let location = useLocation();
    let isLogin = location.pathname === "/"
    const {isTrue,toggleLoader} = Loader();
    const [isLoader,setLoader] = useState(isTrue);
    useEffect(()=>{
        const handler = ()=> toggleLoader();
        window.addEventListener("load",handler);
        return ()=> window.removeEventListener("load",handler)
    },[location.pathname]);

    useEffect(()=>{
        toggleTheme(currentTheme)
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
            <Routes>
                <Route path='/' element={<div className='loginContainer flex items-center content-center h-[100vh] w-[100vw]'>{<LoginEL/>}</div>} />
                <Route path='/Home' element={<div className='routeContainer flex items-center content-center'>{<LoginEL/>}</div>} />
            </Routes>
        </PageTransition>
    )
}