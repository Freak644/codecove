import { getGradientColors } from "./getGradnt";
export const GradientSVG = ({id}) => {
  const [c1, c2, c3] = getGradientColors();

  return (
    <svg width="0" height="0">
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <animate
      attributeName="x1"
      values="0%;200%;0%"
      dur="4s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="y1"
      values="0%;100%;0%"
      dur="4s"
      repeatCount="indefinite"
    />
        <stop offset="0%" stopColor={c1} />
        <stop offset="50%" stopColor={c2} />
        <stop offset="100%" stopColor={c3} />
      </linearGradient>
    </svg>
  );
};