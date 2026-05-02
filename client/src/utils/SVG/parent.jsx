import { useState } from "react";

const Icon = ({ children, className = "", onClick, ...props }) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = (e) => {
    setAnimate(true);

    // reset after animation
    setTimeout(() => setAnimate(false), 300);

    onClick?.(e);
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      onClick={handleClick}
      className={`
        cursor-pointer 
        transition-transform duration-150 hover:scale-95
        ${animate ? "icon-jiggle-click" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </svg>
  );
};