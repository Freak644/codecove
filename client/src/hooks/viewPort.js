import { useEffect } from "react";

export default function useViewportFix() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.visualViewport?.height
        ? window.visualViewport.height * 0.01
        : window.innerHeight * 0.01;

      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();

    window.visualViewport?.addEventListener("resize", setVH);
    window.addEventListener("resize", setVH);

    return () => {
      window.visualViewport?.removeEventListener("resize", setVH);
      window.removeEventListener("resize", setVH);
    };
  }, []);
}