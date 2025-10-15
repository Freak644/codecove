import {create} from 'zustand';

const verifyZu = create((set) => ({
  Tusername: "",
  email: "",
  verifyTab: false,
  emailStatus:false,

  setMail: (mail) => set(() => ({ email: mail })),
  setTUsername: (name) => set(() => ({ Tusername: name })),
  setVTab: () => set((state) => ({ verifyTab: !state.verifyTab })),
  setEstatus: () => set((state) => ({ emailStatus: !state.emailStatus })),
}));
export default verifyZu;