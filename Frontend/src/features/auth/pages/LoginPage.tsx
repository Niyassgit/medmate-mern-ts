import ExampleForm from '@/components/example-form'
import { Link,useLocation } from 'react-router-dom'
import { doctorLogin,repLogin } from '../api'


const LoginPage = () => {
  const location=useLocation();
  const isDoctor=location.pathname.includes("/doctor");

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log("Form values:", values)

    try {
      const { data }=isDoctor ? await doctorLogin(values) : await repLogin(values);
      localStorage.setItem("token",data.token)
      
      alert ("Login successfull 🚀");
      window.location.href=isDoctor? "/doctor/dashboard" : "/rep/dashboard"
 
    } catch (error :any) {
      console.error(error)
      alert(error.response?.data?.message || "Something went wrong")
    }

  
  }
      const handleGoogleLogin = () => {
    console.log("Google login clicked")
    // Redirect to your backend Google OAuth endpoint
  }

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center ">

      <div className="absolute inset-0 "></div>

      <div className="relative z-10 flex w-full max-w-4xl min-h-[500px] md:min-h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">

        <div className="hidden md:flex w-1/2">
          <img
            src="/LoginImg.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

       
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Login Doccure
          </h2>
          <ExampleForm onSubmit={handleLogin} onGoogleLogin={handleGoogleLogin} />

          <div className="flex flex-col items-center mt-4 space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-[#3fa8e9] hover:underline"
            >
              Forgot password?
            </Link>
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-[#3fa8e9] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

    
        </div>
      </div>
    </div>
  )



}

export default LoginPage
