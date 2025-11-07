import { useNavigate } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FeedPostDTO } from "../dto/FeedPostDTO";

interface FeedCardProps {
  post: FeedPostDTO;
  onLike?: (postId: string) => void;
  onInterest?: (postId: string) => void;
  hasLiked?: boolean;
  hasInterested?: boolean;
}

const FeedCard = ({
  post,
  onLike,
  hasInterested,
  hasLiked,
  onInterest,
}: FeedCardProps) => {
  const navigate = useNavigate();
  const { rep, title, image, likes, interests, useCases, createdAt } = post;

  const initials = rep?.name
    ? rep.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleCardClick = () => {
    navigate(`/doctor/feed/${post.id}`);
  };

  return (
    <Card
      className="max-w-xl mx-auto overflow-hidden transition-all hover:shadow-lg bg-card border border-border rounded-2xl cursor-pointer"
      onClick={handleCardClick}
    >
      {/* User Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={rep?.ProfileImage} alt={rep?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground text-sm sm:text-base">
            {rep?.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {rep?.company}
          </p>
        </div>

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Product Image */}
      {image && (
        <div className="w-full bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full max-h-[350px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-card-foreground leading-tight">
          {title}
        </h2>

        {useCases?.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground text-sm">
              Key Benefits
            </h3>
            <ul className="space-y-1.5">
              {useCases.map((benefit, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 text-sm text-muted-foreground border-t border-border">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{likes} Likes</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>{interests} Interests</span>
          </div>
        </div>

        {/* Buttons — stop event from propagating */}
        <div
          className="flex gap-3 pt-3"
          onClick={(e) => e.stopPropagation()} // prevents navigation when clicking buttons
        >
          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onLike?.(post.id)}
          >
            <Heart className="h-4 w-4" />
            {hasLiked ? "Liked" : "Like"}
          </Button>

          <Button
            variant={hasInterested ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onInterest?.(post.id)}
          >
            <Share2 className="h-4 w-4" />
            {hasInterested ? "Interested" : "Show Interest"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeedCard;
