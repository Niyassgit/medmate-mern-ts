import ExampleForm from "@/components/shared/example-form";
import { Link } from "react-router-dom";
import { loginUser } from "../api";
import { Role } from "@/types/Role";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import toast from "react-hot-toast";

const LoginGuest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { data } = await loginUser(values);
      dispatch(login({ token: data.accessToken, user: data.user }));
      
      toast.success("Login successful!");
      
      if (data.user.role === Role.GUEST) {
        navigate("/guest/dashboard", { replace: true });
      } else if (data.user.role === Role.DOCTOR) {
        navigate("/doctor/feed", { replace: true });
      } else if (data.user.role === Role.MEDICAL_REP) {
        navigate("/rep/dashboard", { replace: true });
      } else if (data.user.role === Role.SUPER_ADMIN) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center ">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex w-full max-w-4xl min-h-[500px] md:min-h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/Healthy.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2">
            <img src="/logo.png" alt="MedMate Logo" className="h-25 w-auto" />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Guest Login
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
            Welcome back! Please sign in to access your guest portal.
          </p>
          
          <ExampleForm onSubmit={handleLogin} />

          <div className="flex flex-col items-center mt-4 space-y-2">
            <Link
              to="/forgotpassword"
              className="text-sm text-[#3fa8e9] hover:underline"
            >
              Forgot password?
            </Link>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register/guest" className="text-[#3fa8e9] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginGuest;

