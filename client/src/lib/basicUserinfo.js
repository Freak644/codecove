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

export const univPostStore = create((set)=>({
  posts: {},

  setUnivPost: (data = {}) =>
    set((state) => {
      const incoming = Array.isArray(data) ? data : [data];

      const map = new Map(
        state.posts.map(post => [post.id, post])
      );

      incoming.forEach(post => {
        map.set(post.id, post);
      });

      return {
        posts: Array.from(map.values())
      };
    })

}))