import { useEffect } from 'react';
import {io} from 'socket.io-client';
import HomeSkeleton from './skeletonForHome';
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
      <div className="underTaker">
        <HomeSkeleton/>
      </div>
    );
}