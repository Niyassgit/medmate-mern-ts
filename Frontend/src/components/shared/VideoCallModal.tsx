import { useState } from 'react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onReject: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  callerName,
  callerAvatar,
  onAccept,
  onReject,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept();
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject();
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10"></div>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Caller Avatar */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {callerAvatar ? (
                  <img
                    src={callerAvatar}
                    alt={callerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
                    {callerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call Info */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {callerName}
          </h2>
          <p className="text-gray-600 mb-2">Incoming Video Call</p>

          {/* Video call icon animation */}
          <div className="flex justify-center mb-8">
            <svg
              className="w-12 h-12 text-blue-500 animate-bounce"
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {/* Reject Button */}
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Reject call"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="absolute -bottom-8 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Decline
              </span>
            </button>

            {/* Accept Button */}
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Accept call"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="absolute -bottom-8 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Accept
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VideoCallModal;