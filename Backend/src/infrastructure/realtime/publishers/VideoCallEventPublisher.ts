import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IceCandidate } from "../../../shared/videoCall/IceCandidate";
import { SessionDescription } from "../../../shared/videoCall/SessionDescription";
import { io } from "../SocketGateway";

export class VideoCallEventPublisher implements IVideoCallEventPublisher {
  publishIncomingCall(toUserId: string, fromUserId: string): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:incoming", {
      fromUserId,
    });

    return Promise.resolve();
  }

  publishCallAccepted(
    toUserId: string,
    fromUserId: string,
    answer: SessionDescription
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:accepted", {
      fromUserId,
      answer,
    });
    return Promise.resolve();
  }

  publishIceCandidate(
    toUserId: string,
    fromUserId: string,
    candidate: IceCandidate
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:ice-candidate", {
      fromUserId,
      candidate,
    });
    return Promise.resolve();
  }

  publishCallEnded(toUserId: string, fromUserId: string): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:ended", { fromUserId });
    return Promise.resolve();
  }

  publishCallRejected(toUserId: string, fromUserId: string): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:rejected", { fromUserId });
    return Promise.resolve();
  }

  publishOffer(
    toUserId: string,
    fromUserId: string,
    offer: SessionDescription
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:offer", { fromUserId, offer });
    return Promise.resolve();
  }
}
