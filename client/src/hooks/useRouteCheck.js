import { useEffect, useState } from "react";

export default function useRouteCheck(pathname, toggleLoader) {
  const [isChecking, setCheck] = useState(false);

  useEffect(() => {
    let checkingRoute = ["checkInfo", "resetPassword", "userfound"];
    let currentPath = pathname.split("/");

    if (checkingRoute.includes(currentPath[1])) {
      setCheck(true);
    } else {
      setCheck(false);
    }

    const handler = () => toggleLoader(false);

    if (document.readyState === "complete") {
      handler();
    } else {
      window.addEventListener("load", handler);
    }

    return () => window.removeEventListener("load", handler);
  }, [pathname, toggleLoader]);

  return isChecking;
}