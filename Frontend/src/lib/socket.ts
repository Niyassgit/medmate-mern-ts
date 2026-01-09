import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = (): string | undefined => {
  const wsUrl = import.meta.env.VITE_WS_URL;
  if (wsUrl) {
    return wsUrl;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    return undefined;
  }

  return apiUrl;
};

export const getSocket = (token: string) => {
  if (!token) {
    throw new Error("Token is required to establish socket connection");
  }

  if (!socket) {
    const socketUrl = getSocketUrl();

    if (!socketUrl) {
      throw new Error(
        "Socket URL is not configured. Please set VITE_API_URL or VITE_WS_URL"
      );
    }

    const isProduction =
      socketUrl.includes("https://") ||
      (!socketUrl.includes("localhost") && !socketUrl.includes("127.0.0.1"));
    const transports = isProduction
      ? ["polling", "websocket"]
      : ["websocket", "polling"];

    socket = io(socketUrl, {
      auth: { token },
      transports: transports,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: false,
      upgrade: true,
      rememberUpgrade: false,
    });

    let pollingAttempted = false;

    socket.on("connect_error", (error) => {
      const currentSocket = socket;
      if (currentSocket) {
        if (
          (error.message.includes("websocket") ||
            error.message.includes("WebSocket")) &&
          !pollingAttempted &&
          currentSocket.io.engine
        ) {
          pollingAttempted = true;
          currentSocket.io.opts.transports = ["polling"];
          currentSocket.disconnect();
          currentSocket.connect();
        }
      }
    });

    socket.on("disconnect", (reason) => {
      const currentSocket = socket;
      if (reason === "transport error" && !pollingAttempted && currentSocket) {
        pollingAttempted = true;
        currentSocket.io.opts.transports = ["polling"];
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
