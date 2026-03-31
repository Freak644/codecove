import { commentSocket } from "../socketIO/postSocket.js";
import { changeBioSocket } from "../socketIO/userProfileSocket.js";

export default function initSockets(io) {
  io.on("connection", (socket) => {
    const { user_id } = socket.handshake.auth;

    socket.join(`user_${user_id}`);

    commentSocket(io, socket);
    changeBioSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("User left", socket.id);
    });
  });
}