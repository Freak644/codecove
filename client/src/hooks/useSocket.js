import { useEffect } from "react";

export default function useSocketManager(socket, uID) {
  useEffect(() => {
    if (!uID) return;

    socket.auth = { user_id: uID };
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected →", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [uID, socket]);
}