import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "../lib/toggleTheme";
import '../assets/style/Error404.css'
export default function ThemeButton() {
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  const themes = ["light", "dark-yellow", "dark-white"];

  // handle theme change
  const handleThemeChange = (selected) => {
    toggleTheme(selected);
    setOpen(false);
  };

  // close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

return (
  <div className="relative inline-block h-8 w-8">
    {/* Button */}
    <button
      ref={btnRef}
      id="themeBtn"
      onClick={() => setOpen((prev) => !prev)}
      className="flex items-center flex-row gap-2 px-3 py-1 bg-skin-bg text-skin-text rounded-lg shadow-sm  hover:bg-gray-800/10 active:scale-95 transition-all duration-200"
    >
      <span className="text-sm flex flex-row">
        {theme === "light" && "☀️ Light"}
        {theme === "dark-yellow" && "🌕 Yellow"}
        {theme === "dark-white" && "🌙 White"}
      </span>
    </button>

    {/* Dropdown */}
    {open && (
      <div
        ref={dropdownRef}
        id="themeMenu"
        className="absolute  -translate-x-1/2 bg-skin-bg border border-[text-skin-ptext]/20 rounded-xl shadow-lg p-1 flex flex-col items-start min-w-[110px] z-50 backdrop-blur-md hover:bg-skin-bg/70"
      >
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`w-full text-left cursor-pointer px-3 py-1.5 rounded-lg text-skin-text text-sm hover:bg-gray-800/10 transition-all ${
              t === theme ? "font-semibold" : "opacity-70"
            }`}
          >
            {t === "light" && "☀️ Light"}
            {t === "dark-yellow" && "🌕 Dark Yellow"}
            {t === "dark-white" && "🌙 Dark White"}
          </button>
        ))}
      </div>
    )}
  </div>
);

}
