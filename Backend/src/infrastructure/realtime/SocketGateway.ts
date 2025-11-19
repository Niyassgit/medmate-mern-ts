import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnautharizedError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";
import { AuthenticatedSocket, AuthenticatedUser } from "../types/SocketTypes";
import { JwtPayload } from "../../domain/common/types/JwtPayload";
import logger from "../logger/Logger";

export let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: env.origin.split(",") ?? true, credentials: true },
  });
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      let token = socket.handshake.auth?.token as string | undefined;
      if (!token && socket.handshake.headers.authorization) {
        const authHeader = socket.handshake.headers.authorization.toString();
        token = authHeader.replace(/^Bearer\s+/i, "").trim();
      }
      if (!token) {
        return next(new UnautharizedError(ErrorMessages.UNAUTHORIZED));
      }
      const payload = jwt.verify(token, env.access_token) as JwtPayload;
      const user: AuthenticatedUser = {
        id: payload.userId,
        role: payload.role as AuthenticatedUser["role"],
      };
      socket.user = user;
      next();
    } catch (error) {
      next(new UnautharizedError(ErrorMessages.UNAUTHORIZED));
    }
  });
  io.on("connection", (socket) => {
    const user = socket.user;
    if (!user) {
      logger.warn(ErrorMessages.UNAUTHERIZED_SOCKET);
      socket.disconnect(true);
      return;
    }
    void socket.join(`user:${user.id}`);
    console.log("🔌 Socket connected:", user.id);
  

    socket.on("room:join:product", ({ productId }: { productId: string }) => {
      void socket.join(`product:${productId}`);
    });
    socket.on("room:leave:product", ({ productId }: { productId: string }) => {
      void socket.leave(`product:${productId}`);
    });
        console.log("📌 Joined room:", `user:${user.id}`);
  });
  return io;
}