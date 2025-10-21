import {create} from 'zustand';
export const UnivuUserInfo = create((set)=>({
    userInfo:{},

    setInfo: (userIn) => {
        set({userInfo:userIn})
    }
}))