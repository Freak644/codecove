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
  <div className="relative inline-block">
    <button
      ref={btnRef}
      onClick={() => setOpen((prev) => !prev)}
      className="flex items-center gap-2 px-4 py-1.5 
                 bg-skin-bg/70 backdrop-blur-md 
                 text-skin-text 
                 border border-[text-skin-ptext]/30 
                 rounded-md active:scale-95 
                 hover:bg-skin-bg/90 transition-all"
    >
      {theme === "light" && "☀️ Light"}
      {theme === "dark-yellow" && "🌕 Yellow"}
      {theme === "dark-white" && "🌙 White"}
    </button>

    {open && (
      <div
        ref={dropdownRef}
        className="absolute mt-2 left-0 bg-skin-bg/80 backdrop-blur-lg 
                   border border-[text-skin-ptext]/20 
                   rounded-md shadow-lg p-1 
                   min-w-[120px] z-50"
      >
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => handleThemeChange(t)}
            className={`w-full text-left cursor-pointer px-3 py-1.5 
                        rounded transition-all text-skin-text 
                        ${
                          t === theme
                            ? "font-semibold bg-gray-800/10"
                            : "opacity-70 hover:opacity-100 hover:bg-gray-800/10"
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
