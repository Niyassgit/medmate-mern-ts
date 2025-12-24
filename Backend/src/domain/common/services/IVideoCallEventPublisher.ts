import { IceCandidate } from "../../../shared/videoCall/IceCandidate";
import { SessionDescription } from "../../../shared/videoCall/SessionDescription";

export interface IVideoCallEventPublisher {
  publishIncomingCall(toUserId: string, fromUserId: string): Promise<void>;

  publishOffer(
    toUserId: string,
    fromUserId: string,
    offer: SessionDescription
  ): Promise<void>;

  publishCallAccepted(
    toUserId: string,
    fromUserId: string,
    answer: SessionDescription
  ): Promise<void>;

  publishIceCandidate(
    toUserId: string,
    fromUserId: string,
    candidate: IceCandidate
  ): Promise<void>;

  publishCallEnded(toUserId: string, fromUserId: string): Promise<void>;

  publishCallRejected(toUserId: string, fromUserId: string): Promise<void>;
}
