import { useEffect, useState } from "react";
import {UnivuUserInfo} from '../lib/basicUserinfo.js';
export default function useAuthCheck(toggleTheme, currentTheme) {
  const [isLogin, setLogin] = useState(true);
  const [isAuth, setAuth] = useState(true);
  const {setInfo} = UnivuUserInfo();
  let once = true
  useEffect(() => {
    toggleTheme(currentTheme);

    const checkAuth = async () => {
      if (!once) {
        return;
      }
      once = false
      try {
        let rqst = await fetch("/myServer/auth/checkAuth", {
          credentials: "include",
        });

        let result = await rqst.json();
        if (result.loggedIn) {
          throw new Error(result.details);
        }
        setInfo(result.userInfo);
        setLogin(false);
      } catch (error) {
        sessionStorage.clear();
        // location.reload()
        setLogin(true);
        setAuth(false);
      }
    };

    checkAuth();
  }, [toggleTheme, currentTheme]);

  return { isLogin, isAuth };
}