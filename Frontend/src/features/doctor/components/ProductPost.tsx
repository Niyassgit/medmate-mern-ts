import { Post } from "../dto/RepFullDetailsDTO"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductPostProps {
  post: Post;
}

export const ProductPost = ({ post }: ProductPostProps) => {
    const navigate=useNavigate();
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={post.productImage}
          alt={post.title}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="space-y-3 p-5">
        <div>
          <h3 className="mb-1 line-clamp-2 font-semibold text-foreground">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.brand === "Atoderm" 
              ? "Advanced coronary stent system for improved blood flow and reduced restenosis rates."
              : "Nasal irrigation for managing paranasal sinus diseases with improved efficacy."}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {post.brand}
          </Badge>
          <Button variant="link" className="h-auto p-0 text-sm text-primary" onClick={()=>navigate(`/doctor/feed/${post.id}`)}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
