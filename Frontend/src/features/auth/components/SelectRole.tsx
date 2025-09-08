import { useLocation, useNavigate } from "react-router-dom"
import { googleLogin } from "../api"
import { Button } from "@/components/ui/button"
import { Role } from "@/types/Role"

export default function SelectRolePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const idToken = searchParams.get("idToken")

  const handleRoleSelect = async (role: Role) => {
    if (!idToken) return

    try {
      const response = await googleLogin(idToken, role)
      console.log("Signup success:", response)

      if (response.data.user.role === Role.DOCTOR) navigate("/doctor/dashboard")
      if (response.data.user.role === Role.MEDICAL_REP) navigate("/rep/dashboard")
        if(response.data.user.role===Role.SUPER_ADMIN) navigate("/admin/dashboard")
    } catch (err) {
      console.error("Signup failed:", err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-2xl font-bold">Select Your Role</h1>
      <div className="flex space-x-4">
        <Button onClick={() => handleRoleSelect(Role.DOCTOR)}>I am a Doctor</Button>
        <Button onClick={() => handleRoleSelect(Role.MEDICAL_REP)}>I am a Rep</Button>
      </div>
    </div>
  )
}
