import { getSocket } from "@/lib/socket";
import { WebRTCAdapter } from "@/services/videocall/WebRTCAdapter";
import { IceCandidate } from "@/types/videocall/IceCandidate";
import { SessionDescription } from "@/types/videocall/SessionDescription";
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

  
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

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
    };

    peer.onicecandidate = (event) => {
      if (!token) return;
      if (event.candidate) {
        if (targetUser) {
          const socket = getSocket(token);
          if (socket) {
            socket.emit("call:ice-candidate", {
              toUserId: targetUser,
              candidate: WebRTCAdapter.toIceCandidate(event.candidate),
            });
          }
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
    if (socket) {
      socket.emit("call:offer", {
        toUserId: targetId,
        offer: WebRTCAdapter.toSessionDescription(offer),
      });
    }
  };


  const handleOffer = async (offer: SessionDescription, fromUserId: string) => {
    if (!fromUserId) {
      console.error("handleOffer: fromUserId is required");
      return;
    }

    const peer = await createPeer(fromUserId);

    const rtcOffer = WebRTCAdapter.fromSessionDescription(offer);
    await peer.setRemoteDescription(rtcOffer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    const socket = getSocket(token!);
    if (socket) {
      socket.emit("call:accepted", {
        toUserId: fromUserId,
        answer: WebRTCAdapter.toSessionDescription(answer),
      });
    }

    // Process pending candidates - convert from IceCandidate to RTCIceCandidateInit
    if (pendingCandidates.current.length > 0) {
      for (const candidate of pendingCandidates.current) {
        try {
          const rtcCandidate = WebRTCAdapter.fromIceCandidate(candidate);
          await peer.addIceCandidate(rtcCandidate);
        } catch (e) {
          console.error("Error adding buffered ICE candidate", e);
        }
      }
      pendingCandidates.current = [];
    }
  };

  const pendingCandidates = useRef<IceCandidate[]>([]);

  useEffect(() => {
    const socket = getSocket(token!);
    if (!socket) return;
    socket.on("call:accepted", async ({ answer }) => {
      if (!peerRef.current) return;
      
      // Convert SessionDescription to RTCSessionDescriptionInit
      const rtcAnswer = WebRTCAdapter.fromSessionDescription(answer);
      await peerRef.current.setRemoteDescription(rtcAnswer);

      // Process pending candidates - convert from IceCandidate to RTCIceCandidateInit
      if (pendingCandidates.current.length > 0) {
        for (const candidate of pendingCandidates.current) {
          try {
            const rtcCandidate = WebRTCAdapter.fromIceCandidate(candidate);
            await peerRef.current.addIceCandidate(rtcCandidate);
          } catch (e) {
            console.error("useWebRTC: Error adding buffered ICE candidate", e);
          }
        }
        pendingCandidates.current = [];
      }
    });

    socket.on("call:ice-candidate", async ({ candidate }) => {
      const peer = peerRef.current;

      if (!peer || !peer.remoteDescription) {
        pendingCandidates.current.push(candidate);
        return;
      }

      try {
        const rtcCandidate = WebRTCAdapter.fromIceCandidate(candidate);
        await peer.addIceCandidate(rtcCandidate);
      } catch (e) {
        console.error("useWebRTC: Error adding ICE candidate", e);
      }
    });

    return () => {
      socket.off("call:accepted");
      socket.off("call:ice-candidate");

      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [localStream, token]);

  return {
    localStream,
    remoteStream,
    createOffer,
    handleOffer,
  };
}
