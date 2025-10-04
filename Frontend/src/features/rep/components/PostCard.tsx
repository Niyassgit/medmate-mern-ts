import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface PostCardProps {
  image: string;
  category: string;
  title: string;
  date: string;
  description: string;
  likes: number;
}

const PostCard = ({ image, category, title, date, description, likes }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-video overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {category}
          </Badge>
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-secondary"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-secondary text-secondary" : ""}`} />
          </button>
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-2">
          {title}
        </h3>
        
        <p className="mb-1 text-sm text-muted-foreground">{date}</p>
        
        <p className="mb-4 text-sm text-foreground/80 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{likeCount} Likes</span>
          <Button size="sm" className="bg-secondary hover:bg-secondary/90">
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;