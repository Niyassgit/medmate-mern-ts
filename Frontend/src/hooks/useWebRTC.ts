import { getSocket } from "@/lib/socket";
import { WebRTCAdapter } from "@/services/videocall/WebRTCAdapter";
import { useEffect, useRef, useState } from "react";

export function useWebRTC(remoteUserId: string) {
  const [localStream, setLocalStream] = useState<MediaStream | undefined>(
    undefined
  );
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(
    undefined
  );
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const token = localStorage.getItem("accessToken");

  const createPeer = async (userIdOverride?: string) => {
    const targetUser = userIdOverride || remoteUserId;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error getting user media:", err);
      throw err;
    }

    peer.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peer.oniceconnectionstatechange = () => {
      // ICE connection state change
    };

    peer.onicecandidate = (event) => {
      if (!token) return;
      if (event.candidate) {
        if (targetUser) {
          const socket = getSocket(token);
          socket.emit("call:ice-candidate", {
            toUserId: targetUser,
            candidate: WebRTCAdapter.toIceCandidate(event.candidate),
          });
        }
      }
    };

    peerRef.current = peer;
    return peer;
  };

  const createOffer = async (targetUserId?: string) => {
    const targetId = targetUserId || remoteUserId;
    if (!targetId) return;

    const peer = await createPeer(targetId);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    const socket = getSocket(token!);
    socket.emit("call:offer", {
      toUserId: targetId,
      offer: WebRTCAdapter.toSessionDescription(offer),
    });
  };

  // In useWebRTC.ts
  const handleOffer = async (offer: any) => {
    const peer = await createPeer();

    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    const socket = getSocket(token!);
    socket.emit("call:accepted", {
      toUserId: remoteUserId,
      answer: WebRTCAdapter.toSessionDescription(answer),
    });

    // Process pending candidates
    if (pendingCandidates.current.length > 0) {
      for (const candidate of pendingCandidates.current) {
        try {
          await peer.addIceCandidate(candidate);
        } catch (e) {
          console.error("Error adding buffered ICE candidate", e);
        }
      }
      pendingCandidates.current = [];
    }
  };

  const pendingCandidates = useRef<RTCIceCandidate[]>([]);

  useEffect(() => {
    const socket = getSocket(token!);
    socket.on("call:accepted", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(answer);

      // Process pending candidates
      if (pendingCandidates.current.length > 0) {
        for (const candidate of pendingCandidates.current) {
          try {
            await peerRef.current?.addIceCandidate(candidate);
          } catch (e) {
            console.error("useWebRTC: Error adding buffered ICE candidate", e);
          }
        }
        pendingCandidates.current = [];
      }
    });

    socket.on("call:ice-candidate", async ({ candidate }) => {
      const peer = peerRef.current;

      // If peer doesn't exist yet (Receiver before accept)
      // OR description isn't set (Caller before answer), buffer it.
      if (!peer || !peer.remoteDescription) {
        pendingCandidates.current.push(candidate);
        return;
      }

      try {
        await peer.addIceCandidate(candidate);
      } catch (e) {
        console.error("useWebRTC: Error adding ICE candidate", e);
      }
    });

    return () => {
      socket.off("call:accepted");
      socket.off("call:ice-candidate");
      // Cleanup streams
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    createOffer,
    handleOffer,
  };
}
