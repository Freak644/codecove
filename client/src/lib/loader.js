import {create} from 'zustand';
export const Loader = create((set)=>({
    isTrue:true,
    toggleLoader: (val)=>
        set({isTrue:val})
}))

// export  const toggleLogin = create((set)=>({
//     isLogin:true,
//     loginToggle: (value)=>
//         set((state)=>{
//             const newState =  value;
//             sessionStorage.setItem("status",newState);
//             console.log("there",state.isLogin)
//             return {isLogin:newState}
//         })
// }))