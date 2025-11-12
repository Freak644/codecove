import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "../lib/toggleTheme";

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
      {/* Button */}
      <button
        ref={btnRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1 bg-skin-bg text-skin-text rounded-full shadow-md border border-[text-skin-ptext]/30 hover:bg-gray-800/10 transition-all duration-300"
      >
        {theme === "light" && "☀️ Light"}
        {theme === "dark-yellow" && "🌕 Yellow"}
        {theme === "dark-white" && "🌙 White"}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute -top-28 left-full -translate-x-1/2 bg-skin-bg border border-[text-skin-ptext]/20 rounded-xl shadow-lg p-1 flex flex-col items-start min-w-[90px] z-50"
        >
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`w-full text-left cursor-pointer px-2 py-1 rounded-lg text-skin-text hover:bg-gray-800/10 transition-all ${
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
