import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (token: string) => {
  const wsUrl = import.meta.env.VITE_WS_URL;
  
  if (!wsUrl) {
    console.error("VITE_WS_URL is not defined in environment variables");
    throw new Error("WebSocket URL is not configured");
  }

  const currentToken = socket?.auth && typeof socket.auth === 'object' && 'token' in socket.auth 
    ? (socket.auth as { token?: string }).token 
    : undefined;
  if (!socket || currentToken !== token) {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
    }

    socket = io(wsUrl, {
      auth: { token },
      transports: ["websocket", "polling"], 
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
  } else if (socket.disconnected) {
    socket.auth = { token };
    socket.connect();
  }
  
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
