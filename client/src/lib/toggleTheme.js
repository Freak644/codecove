import {create} from 'zustand';
export const useThemeStore = create((set)=>({
    theme:"dark-white",
    toggleTheme: (inp) =>
        set((state)=>{
            const newTheme =  inp;
            localStorage.setItem("theme",newTheme)
            document.documentElement.setAttribute("data-theme",newTheme);
            return {theme:newTheme};
        }),
}));

export const mngCrop = create((set)=>({
    fileURL:null,
    finalIMG:null,
    setURL: (url)=> set(()=>({fileURL:url})),
    setIMG: (file) => set(()=>({finalIMG:file}))
}));

