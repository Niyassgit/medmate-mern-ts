import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { getSocket } from "../lib/socket";
import { useWebRTC } from "../hooks/useWebRTC";
import VideoCallModal from "../components/shared/VideoCallModal";
import VideoCallScreen from "../components/shared/VideoCallScreen";

interface VideoCallContextType {
    startCall: (
        remoteUserId: string,
        remoteUserName: string,
        remoteUserAvatar?: string
    ) => void;
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
    3;
    const { localStream, remoteStream, createOffer, handleOffer } =
        useWebRTC(currentRemoteId);

    const token = localStorage.getItem("accessToken");

    const cleanupCall = () => {
        setCallState("idle");
        setRemoteUser(null);
        setCurrentRemoteId("");
        setPendingOffer(null);
        window.location.reload();
    };

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
            async ({ offer, fromUserId }: { offer: any; fromUserId: string }) => {
                if (callState === "idle" && fromUserId !== currentRemoteId) {
                    setRemoteUser({
                        id: fromUserId,
                        name: "Incoming Call...",
                        avatar: "",
                    });
                    setCurrentRemoteId(fromUserId);
                    setCallState("incoming");
                }
            }
        );

        socket.on("call:ended", () => {
            cleanupCall();
        });

        return () => {
            socket.off("call:incoming");
            socket.off("call:offer");
            socket.off("call:ended");
        };
    }, [token, callState, currentRemoteId]);

    const [pendingOffer, setPendingOffer] = useState<any>(null);
    useEffect(() => {
        if (!token) return;
        const socket = getSocket(token);
        const onOffer = ({
            offer,
            fromUserId,
        }: {
            offer: any;
            fromUserId: string;
        }) => {
            setPendingOffer(offer);
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
        remoteUserAvatar?: string
    ) => {
        setRemoteUser({
            id: remoteUserId,
            name: remoteUserName,
            avatar: remoteUserAvatar,
        });
        setCurrentRemoteId(remoteUserId);
        setCallState("calling");

        await createOffer(remoteUserId);
    };

    const acceptCall = async () => {
        if (pendingOffer) {
            try {
                await handleOffer(pendingOffer);
                await new Promise((resolve) => setTimeout(resolve, 100));
                setCallState("connected");
            } catch (err) {
                console.error("VideoCallContext: Error in handleOffer", err);
            }
        } else {
            console.error("No pending offer to accept!");
        }
    };

    const rejectCall = () => {
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

export const useVideoCallContext = () => {
    const context = useContext(VideoCallContext);
    if (!context)
        throw new Error(
            "useVideoCallContext must be used within VideoCallProvider"
        );
    return context;
};
