import {create} from 'zustand';

const FaceToggle = create((set)=>({
    currentTab:"front",
    setTab:(tab)=>set(()=>({currentTab:tab}))
}))

export const toggleMini = create((set) => ({
  isMiniTab: {
    usernameCom: true,
    passDiv: false,
  },
  toggleMiniTab: (value) =>
    set({
      isMiniTab: {
        usernameCom: value === "user",
        passDiv: value === "pass",
      },
    }),
}));

export default FaceToggle;