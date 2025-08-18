import { Link } from "react-router-dom"



const LandingPage = () => {
 return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to MedMate</h1>
      <p className="mb-8 text-gray-600 max-w-xl text-center">
        MedMate connects Doctors and Medical Representatives for seamless
        collaboration. Book appointments, explore products, and manage
        connections in one place.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login/doctor"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Login as Doctor
        </Link>
        <Link
          to="/login/rep"
          className="px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Login as Rep
        </Link>
      </div>
      <p className="mt-6">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default LandingPage
