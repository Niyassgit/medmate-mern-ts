import { Heart, Share2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { archivePost } from "../api";
import toast from "react-hot-toast";

interface PostCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  date: string;
  description: string;
  likes: number;
  onImageError?: () => void;
  onArchived?: (postId: string) => void; 
}

const PostCard = ({
  id,
  image,
  category,
  title,
  date,
  description,
  likes,
  onImageError,
  onArchived,
}: PostCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/rep/dashboard/post-details/${id}`
    );
    toast.success("Post link copied to clipboard!");
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmArchive = async () => {
    setLoading(true);
    try {
      const res = await archivePost(id);
      if (res.success) {
        toast.success(res.message || "Post archived successfully");
        setConfirmOpen(false);
        onArchived?.(id);
      } else {
        toast.error(res.message || "Failed to archive post");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/rep/dashboard/post-details/${id}`);
  };

  return (
    <>
      <Card
        className="overflow-hidden shadow-sm transition-all hover:shadow-md hover:scale-[1.015] cursor-pointer rounded-xl max-w-sm"
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={onImageError}
          />
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-sm"
            >
              {category}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2.5">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>

          <p className="text-xs text-muted-foreground">{date}</p>

          <p className="text-sm text-foreground/80 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-between border-t px-4 py-2.5 bg-muted/40">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-muted-foreground transition-all ${
              liked ? "text-pink-500" : "hover:text-pink-500 hover:scale-110"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform ${
                liked ? "fill-pink-500 scale-110" : "hover:fill-pink-500"
              }`}
            />
            <span className="text-sm">{likeCount}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1 text-muted-foreground border-gray-300 transition-all hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>

            {/* Archive Button */}
            <Button
              onClick={handleArchiveClick}
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1 text-muted-foreground border-gray-300 transition-all hover:text-red-600 hover:border-red-400 hover:bg-red-50"
            >
              <Archive className="h-3.5 w-3.5" />
              Archive
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Archive Post"
        message="Are you sure you want to archive this post?"
        onConfirm={handleConfirmArchive}
        onCancel={() => setConfirmOpen(false)}
        confirmButtonClassName="bg-gray-600 text-white hover:bg-gray-700"
        cancelButtonClassName="border border-gray-300"
      />
    </>
  );
};

export default PostCard;
