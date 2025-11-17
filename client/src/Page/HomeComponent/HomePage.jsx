import { useEffect } from 'react';
import {io} from 'socket.io-client';
export default function HonePage() {
    const socket = io("", {
      transports: ["websocket"],
      path: "/myServer/socket.io",   
    });

    useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WS →", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    // cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
    return (
      <div className="p-4 border rounded-lg w-60">
        <div className="bg-gray-500 h-16 w-16 rounded-full animate-pulse"></div>
        <div className="bg-gray-500 h-4 w-40 mt-4 rounded animate-pulse"></div>
        <div className="bg-gray-500 h-4 w-28 mt-2 rounded animate-pulse"></div>
      </div>
    );
}