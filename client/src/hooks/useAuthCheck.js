import { useEffect, useState } from "react";

export default function useAuthCheck(toggleTheme, currentTheme) {
  const [isLogin, setLogin] = useState(true);
  const [isAuth, setAuth] = useState(true);

  useEffect(() => {
    toggleTheme(currentTheme);

    const checkAuth = async () => {
      try {
        let rqst = await fetch("/myServer/auth/checkAuth", {
          credentials: "include",
        });

        let result = await rqst.json();

        if (result.loggedIn) {
          throw new Error(result.details);
        }

        setLogin(false);
      } catch (error) {
        setLogin(true);
        setAuth(false);
      }
    };

    checkAuth();
  }, [toggleTheme, currentTheme]);

  return { isLogin, isAuth };
}