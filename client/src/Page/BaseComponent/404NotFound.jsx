import { useNavigate } from "react-router-dom"

import '../../assets/style/Error404.css'
import { useEffect } from "react";
export default function NotFound() {
    let navi = useNavigate();

    useEffect(() => {
        const pupils = document.querySelectorAll(".pupil-outer");
        const rng = (v) => Math.random() * v * 2 - v + "px";

        const interval = setInterval(() => {
        pupils.forEach((p) => {
            p.style.transform = `translate(${rng(6)}, ${rng(6)})`;
        });
        setTimeout(() => {
            pupils.forEach((p) => (p.style.transform = ""));
        }, 700);
        }, 4300);

        return () => clearInterval(interval);
    }, []);
    return(
        <div className="!h-screen !w-screen !flex !items-center !justify-center bg-skin-bg absolute">
            
        </div>
    )
}