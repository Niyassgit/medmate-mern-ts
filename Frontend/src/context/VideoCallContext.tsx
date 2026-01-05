import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import { getSocket } from "../lib/socket";
import { useWebRTC } from "../hooks/useWebRTC";
import VideoCallModal from "../components/shared/VideoCallModal";
import VideoCallScreen from "../components/shared/VideoCallScreen";
import { useAppSelector } from "../app/hooks";
import { Role } from "../types/Role";
import { callDoctor } from "../features/rep/api";
import { callRep } from "../features/doctor/api";
import toast from "react-hot-toast";
import { WebRTCAdapter } from "../services/videocall/WebRTCAdapter";

interface VideoCallContextType {
    startCall: (
        remoteUserId: string,
        remoteUserName: string,
        remoteUserAvatar?: string,
        repId?: string,
        doctorId?: string
    ) => Promise<void>;
    endCall: () => void;
    isInCall: boolean;
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(
    undefined
);

export const VideoCallProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [callState, setCallState] = useState<
        "idle" | "incoming" | "calling" | "connected"
    >("idle");
    const [remoteUser, setRemoteUser] = useState<{
        id: string;
        name: string;
        avatar?: string;
    } | null>(null);
    const [currentRemoteId, setCurrentRemoteId] = useState<string>("");
    const currentRemoteIdRef = useRef<string>("");
    const [pendingOffer, setPendingOffer] = useState<{offer: RTCSessionDescriptionInit; fromUserId: string} | null>(null);
    const { localStream, remoteStream, createOffer, handleOffer } =
        useWebRTC(currentRemoteId);
    
    const user = useAppSelector((state) => state.auth.user);
    const userRole = user?.role;
    const token = localStorage.getItem("accessToken");

    // Keep ref in sync with state
    useEffect(() => {
        currentRemoteIdRef.current = currentRemoteId;
    }, [currentRemoteId]);

    const cleanupCall = React.useCallback(() => {
        setCallState("idle");
        setRemoteUser(null);
        setCurrentRemoteId("");
        setPendingOffer(null);
        // Stop local stream tracks if they exist
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
    }, [localStream]);

    useEffect(() => {
        if (!token) return;
        const socket = getSocket(token);

        socket.on("call:incoming", ({ fromUserId }: { fromUserId: string }) => {
            setRemoteUser({ id: fromUserId, name: "Dr/Rep", avatar: "" });
            setCallState("incoming");
            setCurrentRemoteId(fromUserId);
        });

        socket.on(
            "call:offer",
            async ({ fromUserId }: { offer?: RTCSessionDescriptionInit; fromUserId: string }) => {
                setRemoteUser((prev) => {
                    // Only update if we're idle or if this is a different user
                    if (!prev || prev.id !== fromUserId) {
                        return {
                            id: fromUserId,
                            name: "Incoming Call...",
                            avatar: "",
                        };
                    }
                    return prev;
                });
                setCurrentRemoteId((prev) => prev || fromUserId);
                setCallState((prev) => prev === "idle" ? "incoming" : prev);
            }
        );

        const handleCallEnded = ({ fromUserId }: { fromUserId: string }) => {
            // Only cleanup if this event is from the current remote user
            if (currentRemoteIdRef.current === fromUserId) {
                cleanupCall();
            }
        };

        const handleCallRejected = ({ fromUserId }: { fromUserId: string }) => {
            // Only cleanup if this event is from the current remote user
            if (currentRemoteIdRef.current === fromUserId) {
                cleanupCall();
                toast.error("Call was rejected");
            }
        };

        socket.on("call:ended", handleCallEnded);
        socket.on("call:rejected", handleCallRejected);

        return () => {
            socket.off("call:incoming");
            socket.off("call:offer");
            socket.off("call:ended", handleCallEnded);
            socket.off("call:rejected", handleCallRejected);
        };
    }, [token, cleanupCall]);

    useEffect(() => {
        if (!token) return;
        const socket = getSocket(token);
        const onOffer = ({
            offer,
            fromUserId,
        }: {
            offer: RTCSessionDescriptionInit;
            fromUserId: string;
        }) => {
            setPendingOffer({ offer, fromUserId });
            if (!currentRemoteId) setCurrentRemoteId(fromUserId);
        };
        socket.on("call:offer", onOffer);
        return () => {
            socket.off("call:offer", onOffer);
        };
    }, [token, currentRemoteId]);

    const startCall = async (
        remoteUserId: string,
        remoteUserName: string,
        remoteUserAvatar?: string,
        repId?: string,
        doctorId?: string
    ) => {
        try {
            if (userRole === Role.MEDICAL_REP && doctorId) {
                try {
                    await callDoctor(doctorId);
                } catch (error: unknown) {
                    const errorMessage =
                      (error as { response?: { data?: { message?: string } } })?.response
                        ?.data?.message || "Subscription plan needed to make video call with doctor";
                    toast.error(errorMessage);
                    return;
                }
            } else if (userRole === Role.DOCTOR && repId) {
                try {
                    await callRep(repId);
                    // If API call succeeds (200 OK), continue with video call
                } catch (error: unknown) {
                    const errorMessage =
                      (error as { response?: { data?: { message?: string } } })?.response
                        ?.data?.message || "Medical Rep doesn't have a valid subscription plan";
                    toast.error(errorMessage);
                    return;
                }
            }

            setRemoteUser({
                id: remoteUserId,
                name: remoteUserName,
                avatar: remoteUserAvatar,
            });
            setCurrentRemoteId(remoteUserId);
            setCallState("calling");

            await createOffer(remoteUserId);
        } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : "Failed to start video call";
            toast.error(errorMessage);
            console.error("Error starting video call:", error);
        }
    };

    const acceptCall = async () => {
        if (pendingOffer) {
            try {
                const sessionDescription = WebRTCAdapter.toSessionDescription(pendingOffer.offer);
                await handleOffer(sessionDescription, pendingOffer.fromUserId);
                await new Promise((resolve) => setTimeout(resolve, 100));
                setCallState("connected");
            } catch (err) {
                console.error("VideoCallContext: Error in handleOffer", err);
                toast.error("Failed to accept call. Please try again.");
            }
        } else {
            console.error("No pending offer to accept!");
            toast.error("No pending offer to accept!");
        }
    };

    const rejectCall = () => {
        const socket = getSocket(token!);
        if (currentRemoteId) {
            socket.emit("call:rejected", { toUserId: currentRemoteId });
        }
        cleanupCall();
    };

    const endCall = () => {
        const socket = getSocket(token!);
        if (currentRemoteId) {
            socket.emit("call:ended", { toUserId: currentRemoteId });
        }
        cleanupCall();
    };

    return (
        <VideoCallContext.Provider
            value={{ startCall, endCall, isInCall: callState !== "idle" }}
        >
            {children}

            <VideoCallModal
                isOpen={callState === "incoming"}
                onClose={rejectCall}
                callerName={remoteUser?.name || "Unknown"}
                callerAvatar={remoteUser?.avatar}
                onAccept={acceptCall}
                onReject={rejectCall}
            />

            <VideoCallScreen
                isOpen={callState === "connected" || callState === "calling"}
                onClose={endCall}
                remoteUserName={remoteUser?.name || "Unknown"}
                remoteUserAvatar={remoteUser?.avatar}
                localStream={localStream}
                remoteStream={remoteStream}
            />
        </VideoCallContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoCallContext = () => {
    const context = useContext(VideoCallContext);
    if (!context)
        throw new Error(
            "useVideoCallContext must be used within VideoCallProvider"
        );
    return context;
};
