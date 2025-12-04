import { io } from "socket.io-client";

const socket = io("", {
  transports: ["websocket"],
  path: "/myServer/socket.io",
  autoConnect: true,
});

export default socket;
