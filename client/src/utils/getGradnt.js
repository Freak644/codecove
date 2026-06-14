import { useThemeStore } from "../lib/toggleTheme";

const getColor = () => {
    let crntTheme = useThemeStore(state=>state.theme);
        switch (crntTheme) {
            case "dark-white" : return "from-yellow-500 via-pink-500 to-orange-400";
            case "dark-yellow" : return "from-purple-500 via-yellow-500 to-blue-600";
            default: return "from-fuchsia-500  via-rose-400 to-purple-500";
        }
    }


const getGradientColors = () => {
  const crntTheme = useThemeStore(state => state.theme);

  switch (crntTheme) {
  case "dark-white":
    return [
      "#ffffff", // white
      "#60a5fa", // soft blue
      "#c084fc", // soft purple
    ];

  case "dark-yellow":
    return [
      "#fff700", // theme yellow
      "#f59e0b", // amber
      "#ff7bff", // orange
    ];

  default:
    return [
      "#00ff00", // neon green
      "#22c55e", // emerald
      "#06b6d4", // cyan
    ];
}
};

export {getColor, getGradientColors}