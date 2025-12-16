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

  setPostOBJ: (data = []) =>
    set((state) => ({
      postOBJ: {
        ...state.postOBJ,
        ...data,  
      },
    })),
}));

export const univPostStore = create((set) => ({
  postsById: {},
  postOrder: [], 
  MAX_POSTS: 30,

  setUnivPost: (data = {}) =>
    set((state) => {
      if (!data || Object.keys(data).length === 0) return state;

      let postsById = { ...state.postsById };
      let postOrder = [...state.postOrder];

      for (const id of Object.keys(data)) {
        if (!postsById[id]) {
          postOrder.push(id);
        }

        postsById[id] = {
          ...(postsById[id] || {}),
          ...data[id],
        };
      }

      while (postOrder.length > state.MAX_POSTS) {
        const removedId = postOrder.shift(); 
        delete postsById[removedId];
      }

      return {
        postsById,
        postOrder,
      };
    })
}));

