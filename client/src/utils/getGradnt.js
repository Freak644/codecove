import { useThemeStore } from "../lib/toggleTheme";

export const getColor = () => {
    let crntTheme = useThemeStore(state=>state.theme);
        switch (crntTheme) {
            case "dark-white" : return "from-purple-500 via-pink-500 to-blue-600";
            case "dark-yellow" : return "from-purple-500 via-yellow-500 to-blue-600";
            default: return "from-fuchsia-500  via-rose-400 to-purple-500";
        }
    }