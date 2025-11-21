import {create} from 'zustand';
export const UnivuUserInfo = create((set)=>({
    userInfo:{},

    setInfo: (userIn) => {
        set({userInfo:userIn})
    }
}));


export const usePostStore = create((set) => ({
  postOBJ: {},

  setPostOBJ: (data) =>
    set((state) => ({
      postOBJ: {
        ...state.postOBJ,
        ...data,  
      },
    })),
}));
