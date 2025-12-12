import {create} from 'zustand';
export const UnivuUserInfo = create((set)=>({
    userInfo:{},
    index:0,

    setInfo: (userIn) => {
        set({userInfo:userIn});
    },
    setIndx: (index)=>{
      set({index:index});
    }
}));


export const usePostStore = create((set) => ({
  postOBJ: {},

  setEmpty:()=> set({postOBJ:{}}),

  setPostOBJ: (data) =>
    set((state) => ({
      postOBJ: {
        ...state.postOBJ,
        ...data,  
      },
    })),
}));
