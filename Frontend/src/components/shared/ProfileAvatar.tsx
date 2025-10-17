import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { getProfileRep } from "@/features/rep/api";
import toast from "react-hot-toast";

interface ProfileAvatarProps {
  image?: string | null;
  name?: string;
  email?: string | null;
  onImageChange?: (file: File) => void;
  onImageError?:()=>Promise<string | null> | void;
  className?: string;
  editable?: boolean;
  userId?: string;
}

const ProfileAvatar = ({
  image,
  name,
  email,
  onImageChange,
  onImageError,
  className = "w-32 h-32 border-4 border-white",
  editable = false,
}: ProfileAvatarProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(image || null);

  useEffect(() => {
    setImgSrc(image || null);
  }, [image]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageChange?.(file);
    }
  };

  const handleImageError =async ()=>{
   if(onImageError){
    const refreshed=await onImageError();
    if(refreshed) setImgSrc(refreshed);
   }
  }
  return (
    <div className="relative inline-block">
      <Avatar className={`${className} rounded-full`}>
        <AvatarImage
          src={preview || imgSrc|| ""}
          alt="Profile"
          onError={handleImageError}
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
