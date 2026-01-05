export class WebRTCAdapter {
    static toSessionDescription(rtc) {
        return {
            type: rtc.type,
            sdp: rtc.sdp || "",
        };
    }
    static fromSessionDescription(sessionDesc) {
        return {
            type: sessionDesc.type,
            sdp: sessionDesc.sdp,
        };
    }
    static toIceCandidate(rtc) {
        return {
            candidate: rtc.candidate,
            sdpMid: rtc.sdpMid ?? undefined,
            sdpMLineIndex: rtc.sdpMLineIndex ?? undefined,
        };
    }
    static fromIceCandidate(ice) {
        return {
            candidate: ice.candidate,
            sdpMid: ice.sdpMid ?? null,
            sdpMLineIndex: ice.sdpMLineIndex ?? null,
        };
    }
}
