import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {VitePWA} from 'vite-plugin-pwa'
export default defineConfig({
  root: "client",   // 👈 this tells Vite where your app lives
  plugins: [react()],
//   VitePWA:({
//     registerType: 'autoUpdate',
//     manifest:{
//   "name": "CodeCove",
//   "short_name": "Cove",
//   "description": "PWA React + Vite",
//   "start_url": "/",
//   "display": "standalone",
//   "background_color": "#00f",
//   "theme_color": "#141338",
//   "icons": [
//     {
//       "src": "https://i.postimg.cc/L4kDbPrj/favicon.png",
//       "sizes": "192x192",
//       "type": "image/png"
//     },
//     {
//       "src": "https://i.postimg.cc/L4kDbPrj/favicon.png",
//       "sizes": "512x512",
//       "type": "image/png"
//     }
//   ]
// }
//   })
//   ,
  server: {
    port: 3221,
    proxy: {
      "/myServer": {
        target: "http://127.0.0.1:3222",
        changeOrigin: true,
        ws:true,
        rewrite: (path) => path.replace(/^\/myServer/, ""),
      },
    },
  },
});
