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
    
    // Detect if we're in production (HTTPS or non-localhost)
    const isProduction = socketUrl.includes("https://") || 
                        (!socketUrl.includes("localhost") && !socketUrl.includes("127.0.0.1"));
    
    // In production, prioritize polling first (more reliable behind proxies/load balancers)
    // Then upgrade to WebSocket if available
    // In development, try WebSocket first for better performance
    const transports = isProduction 
      ? ["polling", "websocket"]  // Polling first in production
      : ["websocket", "polling"]; // WebSocket first in development
    
    // Socket.IO configuration
    // Socket.IO automatically handles protocol conversion:
    // - http://example.com -> uses ws:// for WebSocket
    // - https://example.com -> uses wss:// for WebSocket (secure)
    socket = io(socketUrl, {
      auth: { token },
      transports: transports,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10, // More attempts for production
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      // Auto-upgrade: start with first transport, upgrade if available
      upgrade: true,
      // Allow polling to work even if WebSocket fails
      rememberUpgrade: false,
    });
    
    let pollingAttempted = false;
    
    // Add error handlers for debugging
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      console.error("Attempted URL:", socketUrl);
      const currentSocket = socket;
      if (currentSocket) {
        console.error("Transport:", currentSocket.io.engine?.transport?.name || "unknown");
        
        // If WebSocket fails, force polling
        if ((error.message.includes("websocket") || error.message.includes("WebSocket")) && 
            !pollingAttempted && 
            currentSocket.io.engine) {
          console.warn("WebSocket failed, forcing polling transport...");
          pollingAttempted = true;
          currentSocket.io.opts.transports = ["polling"];
          currentSocket.disconnect();
          currentSocket.connect();
        }
      }
    });
    
    socket.on("connect", () => {
      const currentSocket = socket;
      if (currentSocket) {
        const transport = currentSocket.io.engine?.transport?.name || "unknown";
        console.log(`Socket connected successfully to: ${socketUrl} (transport: ${transport})`);
      }
    });
    
    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      const currentSocket = socket;
      // If disconnected due to transport error, try reconnecting with polling
      if (reason === "transport error" && !pollingAttempted && currentSocket) {
        console.warn("Transport error detected, retrying with polling only...");
        pollingAttempted = true;
        currentSocket.io.opts.transports = ["polling"];
      }
    });
    
    // Monitor transport upgrades
    socket.io.engine?.on("upgrade", () => {
      const currentSocket = socket;
      if (currentSocket) {
        const transport = currentSocket.io.engine?.transport?.name || "unknown";
        console.log(`Socket upgraded to: ${transport}`);
      }
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
