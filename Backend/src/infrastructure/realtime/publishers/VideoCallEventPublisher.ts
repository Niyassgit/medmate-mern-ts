import { IVideoCallEventPublisher } from "../../../domain/common/services/IVideoCallEventPublisher";
import { IceCandidate } from "../../../shared/videoCall/IceCandidate";
import { SessionDescription } from "../../../shared/videoCall/SessionDescription";
import { io } from "../SocketGateway";

export class VideoCallEventPublisher implements IVideoCallEventPublisher {
  async publishIncomingCall(
    toUserId: string,
    fromUserId: string
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:incoming", {
      fromUserId,
    });
  }

  async publishCallAccepted(
    toUserId: string,
    fromUserId: string,
    answer: SessionDescription
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:accepted", {
      fromUserId,
      answer,
    });
  }

  async publishIceCandidate(
    toUserId: string,
    fromUserId: string,
    candidate: IceCandidate
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:ice-candidate", {
      fromUserId,
      candidate,
    });
  }

  async publishCallEnded(toUserId: string, fromUserId: string): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:ended", { fromUserId });
  }

  async publishOffer(
    toUserId: string,
    fromUserId: string,
    offer: SessionDescription
  ): Promise<void> {
    const room = `user:${toUserId}`;
    io.to(room).emit("call:offer", { fromUserId, offer });
  }
}
