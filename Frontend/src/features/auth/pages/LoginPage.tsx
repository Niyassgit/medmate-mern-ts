import ExampleForm from "@/components/shared/example-form";
import { Link } from "react-router-dom";
import { loginUser } from "../api";
import { Role } from "@/types/Role";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../authSlice";
import toast from "react-hot-toast"


const LoginPage = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { data } = await loginUser(values);
      dispatch(login({token:data.accessToken,user:data.user}));
      
      toast.success("User login successfully");
      if (data.user.role === Role.DOCTOR) {
         navigate("/doctor/feed", { replace: true });
      } else if (data.user.role === Role.MEDICAL_REP) {
         navigate("/rep/dashboard", { replace: true });
      } else if (data.user.role === Role.GUEST) {
        navigate("/guest/dashboard", { replace: true });
      } else if (data.user.role === Role.SUPER_ADMIN) {
        navigate("/admin/dashboard", { replace: true });
      } else {
         navigate("/", { replace: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message|| "Login failed")
    }
  };


  return (
    <>

    <div className="relative min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[#185891]">
      <div className="absolute inset-0 "></div>

      <div className="relative z-10 flex w-full max-w-4xl min-h-[500px] md:min-h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/LoginImg.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 ">
            <img src="/logo.png" alt="MedMatelogo" className="h-25 w-auto" />
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Login Doccure
          </h2>
          <ExampleForm
            onSubmit={handleLogin}
          />

          <div className="flex flex-col items-center mt-4 space-y-2">
            <Link
              to="/forgotpassword"
              className="text-sm text-[#3fa8e9] hover:underline"
            >
              Forgot password?
            </Link>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register/doctor" className="text-[#3fa8e9] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
