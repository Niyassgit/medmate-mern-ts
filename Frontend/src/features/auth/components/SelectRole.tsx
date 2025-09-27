import { useState } from "react";
import { UserCheck, Stethoscope, Briefcase, X, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../api";
import toast from "react-hot-toast";

enum Role {
  DOCTOR = "DOCTOR",
  MEDICAL_REP = "MEDICAL_REP",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export default function SelectRolePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idToken = searchParams.get("idToken");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleSelect = async (role: Role) => {
    if (!idToken) return;

    setIsLoading(true);
    setSelectedRole(role);

    try {
  
      const response = await googleLogin(idToken, role);
  

      if (response.data.user.role === Role.DOCTOR) {
        navigate("/doctor/dashboard");
      } else if (response.data.user.role === Role.MEDICAL_REP) {
        navigate("/rep/dashboard");
      } else if (response.data.user.role === Role.SUPER_ADMIN) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      toast.error(errorMessage);
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  const handleClose = () => {
    toast.error("Navigate back to previous page");
     navigate("/auth/login");
  };

  const roles = [
    {
      type: Role.DOCTOR,
      title: "Doctor",
      description:
        "Access patient records, manage appointments, and provide medical care",
      icon: Stethoscope,
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600",
    },
    {
      type: Role.MEDICAL_REP,
      title: "Medical Representative",
      description:
        "Connect with healthcare providers and manage pharmaceutical relationships",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 pb-6 text-center bg-gradient-to-br from-slate-50 to-white border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>

          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <UserCheck size={28} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Role
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Select your professional role to access the appropriate dashboard
            and features
          </p>
        </div>

        {/* Role Selection */}
        <div className="p-8 space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.type;
            const isCurrentlyLoading = isLoading && isSelected;

            return (
              <button
                key={role.type}
                onClick={() => handleRoleSelect(role.type)}
                disabled={isLoading}
                className={`
                  w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
                  ${
                    isCurrentlyLoading
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1"
                  }
                  ${
                    isLoading && !isSelected
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                  group
                `}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`
                    flex items-center justify-center w-14 h-14 rounded-xl shadow-md transition-all duration-300
                    bg-gradient-to-br ${role.color} ${role.hoverColor}
                    ${
                      isCurrentlyLoading
                        ? "animate-pulse"
                        : "group-hover:scale-110 group-hover:shadow-lg"
                    }
                  `}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {role.title}
                      </h3>

                      {isCurrentlyLoading ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          <span>Setting up...</span>
                        </div>
                      ) : (
                        <ArrowRight
                          size={20}
                          className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200"
                        />
                      )}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              🔒 Your selection will determine your dashboard access and
              available features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
