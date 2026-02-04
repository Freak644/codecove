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

export const toggleSlider = create((set)=>({
  isMiniTab: {
    news:false,
    charts:true,
    message:false,
    noti:false
  },
  toggleMiniTab: (value)=> 
    set({
      isMiniTab:{
        news: value === "news",
        charts: value === "charts",
        message: value === "msg",
        noti:value === "noti"
      },
    })
}))

export default FaceToggle;