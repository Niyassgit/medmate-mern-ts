import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnautharizedError } from "../../application/errors";
import { ErrorMessages } from "../../shared/Messages";
import { AuthenticatedSocket, AuthenticatedUser } from "../types/SocketTypes";
import { JwtPayload } from "../../domain/common/types/JwtPayload";
import logger from "../logger/Logger";
import {
  acceptDoctorVideoCallUseCase,
  videoCallEventPublisher,
  acceptRepVideoCallUseCase,
} from "../di/VideoCallDi";

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
  io.on("connection", (socket: AuthenticatedSocket) => {
    const user = socket.user;

    if (!user) {
      logger.warn(ErrorMessages.UNAUTHERIZED_SOCKET);
      socket.disconnect(true);
      return;
    }

    void socket.join(`user:${user.id}`);
    void socket.on(
      "room:join:product",
      ({ productId }: { productId: string }) => {
        void socket.join(`product:${productId}`);
      }
    );

    void socket.on(
      "room:leave:product",
      ({ productId }: { productId: string }) => {
        void socket.leave(`product:${productId}`);
      }
    );

    void socket.on("join_conversation", (conversationId: string) => {
      void socket.join(`conversation:${conversationId}`);
    });

    void socket.on("leave_conversation", (conversationId: string) => {
      void socket.leave(`conversation:${conversationId}`);
    });

    void socket.on(
      "typing:start",
      ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        void io
          .to(`conversation:${conversationId}`)
          .emit("user:typing", { userId, conversationId });
      }
    );

    void socket.on(
      "typing:stop",
      ({
        conversationId,
        userId,
      }: {
        conversationId: string;
        userId: string;
      }) => {
        void io
          .to(`conversation:${conversationId}`)
          .emit("user:stopped_typing", { userId, conversationId });
      }
    );

    socket.on("call:accepted", ({ toUserId, answer }) => {
      console.log(`SocketGateway: Relaying call:accepted from ${user.id} to ${toUserId}`);
      io.to(`user:${toUserId}`).emit("call:accepted", {
        fromUserId: user.id,
        answer
      });
    });

    socket.on("call:ice-candidate", ({ toUserId, candidate }) => {
      io.to(`user:${toUserId}`).emit("call:ice-candidate", {
        fromUserId: user.id,
        candidate,
      });
    });

    socket.on("call:offer", ({ toUserId, offer }) => {
      io.to(`user:${toUserId}`).emit("call:offer", {
        fromUserId: user.id,
        offer
      })
    })

    socket.on("call:ended", ({ toUserId }) => {
      io.to(`user:${toUserId}`).emit("call:ended", { fromUserId: user.id });
    });


  });

  return io;
}

