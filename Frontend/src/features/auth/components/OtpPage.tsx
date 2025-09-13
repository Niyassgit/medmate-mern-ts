import { useState } from "react";
import OtpInput from "react-otp-input";
import { verifyOtp } from "../api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    if (otp.length < 6) {
      setMessage("Please enter full OTP");
    }

    try {
      setLoading(true);
      const res = await verifyOtp(email, otp);
      console.log("response object:", res);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 1500);

    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-semibold mb-4">
        Enter OTP sent to <span className="font-mono">{email}</span>
      </h2>
      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        renderSeparator={<span>-</span>}
        renderInput={(props) => (
          <input {...props} className="w-10 h-10 border rounded text-center" />
        )}
      />
      <button
        onClick={handleVerify}
        disabled={loading || otp.length < 6}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};
export default OtpPage;
