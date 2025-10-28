import { useCallback } from "react";
import FeedCard from "@/features/doctor/components/FeedCard";
import { useSelector } from "react-redux";
import { getAllFeed } from "../api";
import toast from "react-hot-toast";
import useFetchItem from "@/hooks/useFetchItem";
import { FeedPostDTO } from "../dto/FeedPostDTO";

const Feed = () => {
  const id = useSelector((state: any) => state.auth.user?.id);

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

  const {
    data: feedData = [],
    loading,
    error,
  } = useFetchItem<FeedPostDTO[]>(fetchPosts);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-muted">
        Loading feed...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );
  console.log("fetched data:", feedData);

  return (
    <div className="p-6 space-y-6">
      {feedData && feedData.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No feed posts available
        </p>
      ) : (
        feedData &&feedData.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onLike={(id)}
            onInterest={(id)}
          />
        ))
        
      )}
      
    </div>
  );
};

export default Feed;
