import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
    if (!socket) {
    socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
  } else if (socket.disconnected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
