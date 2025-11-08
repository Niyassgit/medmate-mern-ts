import { useCallback, useEffect, useState } from "react";
import FeedCard from "@/features/doctor/components/FeedCard";
import { useSelector } from "react-redux";
import { getAllFeed, handleLikeToggle } from "../api";
import toast from "react-hot-toast";
import useFetchItem from "@/hooks/useFetchItem";
import { FeedPostDTO } from "../dto/FeedPostDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";

const Feed = () => {
  const id = useSelector((state: any) => state.auth.user?.id);
  const [localFeed, setLocalFeed] = useState<FeedPostDTO[]>([]);

  const fetchPosts = useCallback(async () => {
    if (!id) return [];
    try {
      const data = await getAllFeed(id);
      return data.data as FeedPostDTO[];
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch feed");
      return [];
    }
  }, [id]);

  const { data: feedData = [], loading, error } =
    useFetchItem<FeedPostDTO[]>(fetchPosts);

  useEffect(() => {
    if (feedData && feedData.length > 0) {
      setLocalFeed(feedData);
    }
  }, [feedData]);

  const handleLike = async (postId: string) => {
    try {
      const res = await handleLikeToggle(postId);
      toast.success(res.data.message);

      setLocalFeed((prev) =>
        prev.map((item) =>
          item.id === postId
            ? {
                ...item,
                liked: res.data.liked,
                likes: res.data.totalLikes, 
              }
            : item
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
    }
  };
  if (loading) return <SpinnerButton />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );

   return (
    <div className="p-6 space-y-6">
      {!localFeed.length ? (
        <p className="text-center text-muted-foreground">
          No feed posts available
        </p>
      ) : (
        localFeed.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onLike={() => handleLike(post.id)}
            onInterest={() => toast("Coming soon!")}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
