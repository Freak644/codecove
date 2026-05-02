import { useLocation } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";

const LoginEL = lazy(()=> import("../Page/Auth/baseFIle"))
const MenuEL = lazy(()=> import("../GlobalComponent/menu"));

const Header = lazy(()=> import("../GlobalComponent/header"));
import LoaderEL from "../assets/animations/loadingBar";
const CropperEL = lazy(() => import("./cropperEL"));
const WindowHerder = lazy(()=> import("../GlobalComponent/windowHeader"))
const AbsoluteMenu = lazy(()=> import("../GlobalComponent/absoluteMenu"))

const AnimateRoute = lazy(() => import('./Routes/AnimateRoute'));
const NoAnimRoutes = lazy(() => import('./Routes/noAnimationRoute'));

import { Loader } from "../lib/loader";
import { mngCrop, useThemeStore } from "../lib/toggleTheme";
import { UnivuUserInfo } from "../lib/basicUserinfo";

import socket from "../utils/socket";

// 🔥 new hooks
import useViewportFix from "../hooks/viewPort";
import useSocketManager from "../hooks/useSocket";
import useAuthCheck from "../hooks/useAuthCheck";
import useRouteCheck from "../hooks/useRouteCheck";

import '../assets/style/paseTwo.css'

export default function MyApp() {
  useViewportFix();

  const { toggleTheme } = useThemeStore();
  const currentTheme = localStorage.getItem("theme") || "dark-white";

  const { isLogin, isAuth } = useAuthCheck(toggleTheme, currentTheme);

  const { isTrue, toggleLoader } = Loader();

  const location = useLocation();
  const isChecking = useRouteCheck(location.pathname, toggleLoader);

  const uID = UnivuUserInfo((stat) => stat.userInfo?.id);
  useSocketManager(socket, uID);

  const { fileURL } = mngCrop();
  const [isCropping, setCropping] = useState(false);

  useEffect(() => {
    setCropping(fileURL?.length > 1);
  }, [fileURL]);

  const [windowHeader, setHeader] = useState(true);

  useEffect(() => {
    if (window.innerWidth > 1023) setHeader(true);
    else setHeader(false);
  }, []);

  return (
    <>
      {isTrue && <LoaderEL />}

      {windowHeader && !isLogin && !isChecking && <Suspense fallback={null}>
          <WindowHerder/>
        </Suspense>}
      {!isLogin && !isChecking && <Suspense fallback={null}>
            <Header/>
        </Suspense>}
      {!isLogin && !isChecking && <Suspense fallback={null}>
            <MenuEL />
        </Suspense>}

      {isCropping && (
            <Suspense fallback={<div className="miniLoader"/>}>
                <CropperEL prevImg={fileURL} />
            </Suspense>
        )}

      <Suspense fallback={null}>
        <AbsoluteMenu />
      </Suspense>

      {isLogin && !isAuth && !isChecking && (
            <div className="loginContainer flex items-center content-center h-screen w-screen">
                <Suspense fallback={<div className="miniLoader"/>}>
                    <LoginEL />
                </Suspense>
            </div>
        )}

      {(!isLogin || isChecking) && (
        <Suspense fallback={<div className="miniLoader"/>}>
            {isChecking ? <NoAnimRoutes /> : <AnimateRoute location={location} />}
        </Suspense>
      )}
    </>
  );
}