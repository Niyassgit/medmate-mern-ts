import { useState, useEffect, useRef } from "react";

interface VideoCallScreenProps {
  isOpen: boolean;
  onClose: () => void;
  remoteUserName: string;
  remoteUserAvatar?: string;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
  isOpen,
  onClose,
  remoteUserName,
  remoteUserAvatar,
  localStream,
  remoteStream,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Timer for call duration
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Handle remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      // Ensure video plays (some browsers/policies require explicit play)
      remoteVideoRef.current.play().catch(console.error);
    }
  }, [remoteStream, remoteStream?.id]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
  };

  const handleEndCall = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setCallDuration(0);
    onClose();
  };

  if (!isOpen) return null;

  
  if (!localStream) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center">
        <div className="text-white">Setting up camera...</div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 bg-gray-900">
      {/* Main Video Container */}
      <div className="relative w-full h-full">
        {/* Remote Video (Full Screen) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
          {remoteStream ? (
            <video
              key={remoteStream.id}
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold mb-4 shadow-xl">
                {remoteUserAvatar ? (
                  <img
                    src={remoteUserAvatar}
                    alt={remoteUserName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  remoteUserName.charAt(0).toUpperCase()
                )}
              </div>
              <p className="text-white text-xl font-medium">{remoteUserName}</p>
              <p className="text-gray-400 text-sm mt-2">Connecting...</p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div
          className={`absolute ${
            isMinimized ? "bottom-24 right-4" : "top-4 right-4"
          } transition-all duration-300`}
        >
          <div
            className={`${
              isMinimized ? "w-24 h-32" : "w-40 h-52"
            } rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gray-800 relative group`}
          >
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                <svg
                  className="w-12 h-12 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMinimized ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
            </button>
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              You
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {remoteUserAvatar ? (
                  <img
                    src={remoteUserAvatar}
                    alt={remoteUserName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  remoteUserName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">{remoteUserName}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm">
                    {formatDuration(callDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
          <div className="flex items-center justify-center gap-4">
            {/* Toggle Microphone */}
            <button
              onClick={handleToggleMute}
              className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                isMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30 backdrop-blur-md"
              }`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
              <span className="absolute -top-8 text-xs text-white bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="group relative w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-xl active:scale-95"
              aria-label="End call"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                  transform="rotate(135 12 12)"
                />
              </svg>
              <span className="absolute -top-8 text-xs text-white bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                End Call
              </span>
            </button>

            {/* Toggle Video */}
            <button
              onClick={handleToggleVideo}
              className={`group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                isVideoOff
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/20 hover:bg-white/30 backdrop-blur-md"
              }`}
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                  <line x1="3" y1="3" x2="21" y2="21" strokeWidth={2} />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span className="absolute -top-8 text-xs text-white bg-black/50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isVideoOff ? "Turn On" : "Turn Off"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
};

export default VideoCallScreen;
