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
      return ["#eab308", "#ec4899", "#fb923c"]; // yellow → pink → orange

    case "dark-yellow":
      return ["#a855f7", "#eab308", "#2563eb"]; // purple → yellow → blue

    default:
      return ["#d946ef", "#fb7185", "#a855f7"]; // fuchsia → rose → purple
  }
};

export {getColor, getGradientColors}