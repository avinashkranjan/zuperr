import { io } from "socket.io-client";
import { BACKEND_API_URL } from "./lib/config";

const socket = io(BACKEND_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
