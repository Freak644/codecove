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


export const usePostStore = create((set) => ({ // this stor is use when user is cretin a post 
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


export const univPostStore = create((set, get) => ({
  postsById: {},
  postOrder: [],
  postSet: new Set(), // 🔥 O(1) lookup
  MAX_POSTS: 30,

  removePost:(post_id) => 
    set((stat) => {
      const postsById = { ...stat.postsById };
      let postOrder = [...stat.postOrder];
      let postSet = new Set(stat.postSet);

      postSet.delete(post_id);
      delete postsById[post_id];
      postOrder = postOrder.filter(post=>post.post_id !== post_id);

      return {
        postsById,
        postOrder,
        postSet
      }
    }),

  setUnivPost: (data = {}) =>
    set((state) => {
      // console.log(data)
      if (!data || Object.keys(data).length === 0) return state;

      // 🧠 clone only once
      const postsById = { ...state.postsById };
      let postOrder = [...state.postOrder];
      const postSet = new Set(state.postSet);

      for (const id in data) {
        const incoming = data[id];

        // ✅ add to order if new
        if (!postSet.has(id)) {
          postOrder.push(id);
          postSet.add(id);
        }

        // ✅ shallow merge (safe + avoids overwrite)
        postsById[id] = {
          ...(postsById[id] || {}),
          ...incoming,
        };
      }

      // 🔥 efficient trimming (NO shift loop)
      if (postOrder.length > state.MAX_POSTS) {
        const removeCount = postOrder.length - state.MAX_POSTS;

        const removedIds = postOrder.slice(0, removeCount);
        postOrder = postOrder.slice(removeCount);

        for (const id of removedIds) {
          delete postsById[id];
          postSet.delete(id);
        }
      }

      return {
        postsById,
        postOrder,
        postSet,
      };
    }),

  // 🧹 optional helper
  clearPosts: () =>
    set({
      postsById: {},
      postOrder: [],
      postSet: new Set(),
    }),

  // 🧠 get ordered posts (selector helper)
  getPostsArray: () => {
    const { postsById, postOrder } = get();
    return postOrder.map((id) => postsById[id]);
  },
}));