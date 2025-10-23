import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck, Share2 } from "lucide-react"
import { NetworkResponseDTO } from "../dto/NetworkResponseDTO"

interface ConnectionCardProps {
  user: NetworkResponseDTO
  isConnected: boolean
  onConnect: () => void
}

export default function Networks({ user, isConnected, onConnect }: ConnectionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5" />

      {/* Profile Image */}
      <div className="relative px-6 pb-4">
        <div className="flex flex-col items-center -mt-16 mb-4">
          <div className="relative">
            <img
              src={user.profileImage || "/placeholder.svg?height=120&width=120&query=default-avatar"}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-card object-cover shadow-md"
            />
            {isConnected && (
              <div className="absolute bottom-0 right-0 bg-[#3175B4] rounded-full p-1.5 shadow-md">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground text-balance">{user.name}</h3>
          <p className="text-sm text-[#3175B4] font-medium mt-1">{user.companyName}</p>
          {user.about && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{user.about}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            onClick={onConnect}
            className={`flex-1 gap-2 text-white ${
              isConnected
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-[#3175B4] hover:bg-[#25629A]"
            }`}
            size="sm"
          >
            {isConnected ? (
              <>
                <UserCheck className="w-4 h-4" />
                Connected
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Connect
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="px-3 bg-transparent hover:bg-[#f5f5f5]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
