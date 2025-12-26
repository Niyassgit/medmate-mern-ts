import { SessionDescription } from "@/types/videocall/SessionDescription";
import { IceCandidate } from "@/types/videocall/IceCandidate";

export class WebRTCAdapter {
  static toSessionDescription(
    rtc: RTCSessionDescriptionInit
  ): SessionDescription {
    return {
      type: rtc.type as "offer" | "answer",
      sdp: rtc.sdp || "",
    };
  }

  static fromSessionDescription(
    sessionDesc: SessionDescription
  ): RTCSessionDescriptionInit {
    return {
      type: sessionDesc.type,
      sdp: sessionDesc.sdp,
    };
  }

  static toIceCandidate(rtc: RTCIceCandidate): IceCandidate {
    return {
      candidate: rtc.candidate,
      sdpMid: rtc.sdpMid ?? undefined,
      sdpMLineIndex: rtc.sdpMLineIndex ?? undefined,
    };
  }

  static fromIceCandidate(ice: IceCandidate): RTCIceCandidateInit {
    return {
      candidate: ice.candidate,
      sdpMid: ice.sdpMid ?? null,
      sdpMLineIndex: ice.sdpMLineIndex ?? null,
    };
  }
}
