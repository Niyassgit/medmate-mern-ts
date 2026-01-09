import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Get the Socket.IO connection URL
 * Socket.IO can use the same HTTP/HTTPS URL as the API - it will automatically
 * use ws:// for HTTP and wss:// for HTTPS
 */
const getSocketUrl = (): string | undefined => {
  // If VITE_WS_URL is explicitly set, use it
  const wsUrl = import.meta.env.VITE_WS_URL;
  if (wsUrl) {
    return wsUrl;
  }
  
  // Otherwise, use the same base URL as the API
  // Socket.IO will automatically handle protocol conversion (http -> ws, https -> wss)
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn("VITE_API_URL is not set. Socket connection may fail.");
    return undefined;
  }
  
  // Return the API URL directly - Socket.IO handles the WebSocket upgrade internally
  return apiUrl;
};

export const getSocket = (token: string) => {
  if (!token) {
    throw new Error("Token is required to establish socket connection");
  }

  if (!socket) {
    const socketUrl = getSocketUrl();
    
    if (!socketUrl) {
      throw new Error("Socket URL is not configured. Please set VITE_API_URL or VITE_WS_URL");
    }
    
    // Socket.IO configuration
    // Socket.IO automatically handles protocol conversion:
    // - http://example.com -> uses ws:// for WebSocket
    // - https://example.com -> uses wss:// for WebSocket (secure)
    socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"], // Allow polling fallback for production
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      // Auto-upgrade: try websocket first, fallback to polling if needed
      upgrade: true,
    });
    
    // Add error handlers for debugging
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      console.error("Attempted URL:", socketUrl);
    });
    
    socket.on("connect", () => {
      console.log("Socket connected successfully to:", socketUrl);
    });
    
    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
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
