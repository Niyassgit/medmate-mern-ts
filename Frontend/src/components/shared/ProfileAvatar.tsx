import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

interface ProfileAvatarProps {
  image?: string | null;
  name?: string;
  email?: string | null;
  onImageChange?: (file: File) => void; 
  className?: string;
  editable?: boolean; 
}

const ProfileAvatar = ({
  image,
  name,
  email,
  onImageChange,
  className = "w-32 h-32 border-4 border-white",
  editable = false,
}: ProfileAvatarProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageChange?.(file);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${className} rounded-full`}>
        <AvatarImage
          src={preview || image || ""}
          alt="Profile"
          className="object-cover"
        />
        <AvatarFallback className="text-2xl">
          {name?.charAt(0).toUpperCase() ||
            email?.charAt(0).toUpperCase() ||
            "U"}
        </AvatarFallback>
      </Avatar>

      {editable && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
