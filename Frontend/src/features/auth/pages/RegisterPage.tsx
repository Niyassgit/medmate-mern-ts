import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import SignupRep from './SignupRep';
import SignupDoctor from './SignupDoctor';
import { Link } from 'react-router-dom';



const RegisterPage = () => {
  const { type } = useParams<{ type?: string }>();

  const [formType, setFormType] = useState<"doctor" | "rep">(
    type === "rep" ? "rep" : "doctor"
  );

  useEffect(() => {
    if (type === "rep") {
      setFormType("rep");
    } else {
      setFormType("doctor");
    }
  }, [type]);

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center bg-gradient-to-b from-[#185891]">
      <div className="absolute inset-0"></div>

      <div className="relative z-10 flex w-full max-w-5xl min-h-[500px] md:min-h-[600px] rounded-2xl shadow-2xl overflow-hidden bg-white">

        {/* Left image + logo */}
        <div className="hidden md:flex w-1/2 relative">
          <img
            src="/med-rep-mar-8-2.png"
            alt="Register"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0">
            <img src="/logo.png" alt="MedMateLogo" className="h-20 w-auto" />
          </div>
        </div>

        {/* Right form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
            Create your account
          </h2>

          <div className="text-center mb-6">
            {formType === "doctor" ? (
              <p className="text-gray-600">
                Not a Doctor?{" "}
                <button
                  onClick={() => setFormType("rep")}
                  className="text-[#3fa8e9] font-medium hover:underline"
                >
                  Register as a Medical Representative
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Not a Medical Representative?{" "}
                <button
                  onClick={() => setFormType("doctor")}
                  className="text-[#3fa8e9] font-medium hover:underline"
                >
                  Register as a Doctor
                </button>
              </p>
            )}
          </div>

          {formType === "doctor" ? <SignupDoctor /> : <SignupRep />}

          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to={`/auth/login`} className="text-[#3fa8e9] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
