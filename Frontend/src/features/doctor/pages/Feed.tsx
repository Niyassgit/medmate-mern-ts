import { useCallback, useEffect, useMemo, useState } from "react";
import FeedCard from "@/features/doctor/components/FeedCard";
import { useSelector } from "react-redux";
import { getAllFeed, handleInterestToggle, handleLikeToggle } from "../api";
import toast from "react-hot-toast";
import useFetchItem from "@/hooks/useFetchItem";
import { FeedPostDTO } from "../dto/FeedPostDTO";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import { getSocket } from "@/lib/socket";
import noResult from "@/assets/noResult.png";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Feed = () => {
  const auth = useSelector((s: any) => s.auth.user);
  const id = auth?.id as string | undefined;
  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  const [localFeed, setLocalFeed] = useState<FeedPostDTO[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    setLocalFeed(feedData ?? []);
  }, [feedData]);

  useEffect(() => {
    if (!token || !id) return;
    const socket = getSocket(token);

    const onLikeToggled = (payload: {
      productId: string;
      counts?: { likes: number };
      liked?: boolean;
      doctorId: string;
    }) => {
      setLocalFeed((prev) =>
        prev.map((p) => {
          if (p.id === payload.productId) {
            const updatedPost = {
              ...p,
              likes: payload.counts?.likes ?? p.likes,
            };

            if (payload.liked !== undefined) {
              // For now, just update the count - the API response handles user state
            }
            return updatedPost;
          }
          return p;
        })
      );
    };

    const onInterestToggled = (payload: {
      productId: string;
      doctorId: string;
      interested: boolean;
      counts?: { interests: number };
    }) => {
      setLocalFeed((prev) =>
        prev.map((p) => {
          if (p.id === payload.productId) {
            return {
              ...p,
              interests: payload.counts?.interests ?? p.interests,
              // Only update interested state if we have it - API response handles user state
            };
          }
          return p;
        })
      );
    };

    socket.on("like:toggled", onLikeToggled);
    socket.on("interest:toggled", onInterestToggled);

    return () => {
      socket.off("like:toggled", onLikeToggled);
      socket.off("interest:toggled", onInterestToggled);
    };
  }, [token, id]);

  useEffect(() => {
    if (!token || localFeed.length === 0) return;
    const socket = getSocket(token);

    const joinRooms = () => {
      localFeed.forEach((post) => {
        socket.emit("room:join:product", { productId: post.id });
      });
    };

    if (socket.connected) {
      joinRooms();
    } else {
      socket.once("connect", () => {
        joinRooms();
      });
      const timeout = setTimeout(() => {
        if (socket.connected) {
          joinRooms();
        }
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [token, localFeed]);

  const handleLike = async (postId: string) => {
    try {
      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: p.liked ? p.likes - 1 : p.likes + 1,
                liked: !p.liked,
              }
            : p
        )
      );

      const res = await handleLikeToggle(postId);
      toast.success(res.data.message);

      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: res.data.totalLikes, liked: res.data.liked }
            : p
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: p.liked ? p.likes + 1 : p.likes - 1,
                liked: !p.liked,
              }
            : p
        )
      );
    }
  };

  const handleInterest = async (postId: string) => {
    try {
      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                interests: p.interested ? p.interests - 1 : p.interests + 1,
                interested: !p.interested,
              }
            : p
        )
      );

      const res = await handleInterestToggle(postId);
      toast.success(res.data.message);

      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                interests: res.data.totalInterests ?? p.interests,
                interested: res.data.interested,
              }
            : p
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle interest");
      setLocalFeed((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                interests: p.interested ? p.interests + 1 : p.interests - 1,
                interested: !p.interested,
              }
            : p
        )
      );
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
        <div className="flex flex-col justify-center items-center py-16 text-center space-y-4">
          <img
            src={noResult}
            alt="No feed result"
            className="w-60 h-60 object-contain opacity-90"
          />
          <h2 className="text-lg font-semibold text-foreground">
            Oops! No feed found
          </h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Don’t worry — connect with more reps and explore new opportunities
            in your network!
          </p>
          <Button
            className="bg-pink-500 hover:bg-pink-600"
            onClick={() => navigate(`/doctor/network`)}
          >
            <div className="flex items-center gap-x-2 group">
              <p>Explore</p>
              <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Button>
        </div>
      ) : (
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {localFeed.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            hasLiked={post.liked}
            hasInterested={post.interested}
            onLike={() => handleLike(post.id)}
            onInterest={() => handleInterest(post.id)}
          />
        ))}
      </div>
    )}
  </div>
  );
};

export default Feed;
