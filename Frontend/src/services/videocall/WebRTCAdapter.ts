import RTCSessionDescriptionInit from "webrtc";
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

  static toIceCandidate(rtc: RTCIceCandidate): IceCandidate {
    return {
      candidate: rtc.candidate,
      sdpMid: rtc.sdpMid ?? undefined,
      sdpMLineIndex: rtc.sdpMLineIndex ?? undefined,
    };
  }
}
