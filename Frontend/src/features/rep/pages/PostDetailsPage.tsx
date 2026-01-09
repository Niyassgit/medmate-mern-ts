import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  Calendar,
  Package,
  MapPin,
  Edit,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { PostDetailsDTO } from "../dto/PostDetailsDTO";
import { postDetails, deleteProductPost } from "../api";
import useFetchItem from "@/hooks/useFetchItem";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPostDetails = useCallback(() => {
    if (!id) return Promise.resolve([]);
    return postDetails(id);
  }, [id]);

  const {
    data: post,
    loading,
    error,
  } = useFetchItem<PostDetailsDTO | null>(fetchPostDetails);

  useEffect(() => {
    if (post?.imageUrl) {
      setImageUrls(post.imageUrl);
    }
  }, [post]);

  const handleDeletePost = async () => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      await deleteProductPost(id);
      toast.success("Post deleted successfully!");
      setConfirmOpen(false);
      setTimeout(() => navigate(-1), 800);
    } catch{
      toast.error("Failed to delete post!");
    } finally {
      setDeleteLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src="/loading.gif" alt="Loading..." className="h-16 w-16" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/30">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">post not found</h2>
          <Button onClick={() => navigate("/posts")} className="mt-4">
            Back to posts
          </Button>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === post.imageUrl.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.imageUrl.length - 1 : prev - 1
    );
  };

  const handleErrorImage = async () => {
    try {
      const res = await postDetails(id!);
      if (res.success && res.data?.data?.imageUrl) {
        setImageUrls(res.data.data.imageUrl);
      }
    } catch {
      toast.error(
        "Something went wriong!..undable to acess data right the moment"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/rep/post-edit/${post.id}`)}
                className="gap-2 hover:bg-primary hover:text-primary-foreground"
              >
                <Edit className="h-4 w-4" />
                Edit Post
              </Button>

              <Button
                variant="destructive"
                onClick={() => setConfirmOpen(true)}
                disabled={deleteLoading}
                className="gap-2 bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-6 animate-fade-in">
              <Card className="relative aspect-square overflow-hidden border-border bg-muted">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  onError={() => handleErrorImage()}
                />

                {post.imageUrl.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg transition-all hover:bg-background hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg transition-all hover:bg-background hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {post.offer && (
                  <Badge className="absolute right-4 top-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] text-primary-foreground">
                    {post.offer}
                  </Badge>
                )}
              </Card>

              {/* Thumbnail Gallery */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {imageUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-primary scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        key={idx}
                        src={url}
                        alt={`${post.title} ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={() => handleErrorImage()}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Use Cases */}
              {post.useCases.length > 0 && (
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    Use Cases
                  </h2>
                  <div className="space-y-3">
                    {post.useCases.map((useCase, idx) => (
                      <Card
                        key={idx}
                        className="border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {idx + 1}
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {useCase}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {post.ingredients && post.ingredients.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 text-lg font-semibold text-foreground">
                    Key Ingredients
                  </h2>
                  <div className="space-y-4">
                    {post.ingredients.map((ingredient, idx) => {
                      // Split ingredient into 30-word chunks
                      const words = ingredient.split(/\s+/);
                      const chunks: string[] = [];
                      for (let i = 0; i < words.length; i += 30) {
                        chunks.push(words.slice(i, i + 30).join(" "));
                      }

                      return chunks.map((chunk, cidx) => (
                        <p
                          key={`${idx}-${cidx}`}
                          className="text-sm leading-relaxed text-muted-foreground"
                        >
                          {chunk}
                        </p>
                      ));
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* post Info */}
            <div
              className="space-y-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Title & Brand */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{post.brand}</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                  {post.title}
                </h1>
              </div>

              {/* Rating & Meta Info */}
              <div className="flex flex-wrap items-center gap-4">
                {post.rate && (
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-secondary-foreground">
                      {post.rate}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      rating
                    </span>
                  </div>
                )}

                {post.territoryId && (
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-secondary-foreground">
                      {post.territoryId}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  Description
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
              </div>

              <Separator />

              {/* Terms of Use */}
              <div>
                <h2 className="mb-3 text-lg font-semibold text-foreground">
                  How to Use
                </h2>
                <Card className="border-border bg-secondary/50 p-4">
                  <p className="text-sm leading-relaxed text-secondary-foreground">
                    {post.termsOfUse}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post? This action cannot be undone."
        onConfirm={handleDeletePost}
        onCancel={() => setConfirmOpen(false)}
        confirmButtonClassName="bg-red-600 text-white hover:bg-red-700"
        cancelButtonClassName="border border-gray-300"
      />
    </div>
  );
};

export default PostDetailsPage;
