import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PostForm from "../components/PostFormProps";
import { postDetails, updatePost } from "../api";
import useFetchItem from "@/hooks/useFetchItem";
import { PostDetailsDTO } from "../dto/PostDetailsDTO";
import { ProductPostFormValues } from "../schemas/ProductPostSchema";

const PostEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPostDetails = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return postDetails(id);
  }, [id]);

  const {
    data: post,
    loading,
    error,
  } = useFetchItem<PostDetailsDTO | null>(fetchPostDetails);

  const handleEditSubmit = async (
    values: ProductPostFormValues,
    images: File[]
  ) => {
    if (!id) return;
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "existingImages") {
        return;
      }

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    });

    if (values.existingImages && Array.isArray(values.existingImages)) {
      values.existingImages.forEach((img) => {
        if (typeof img === "string" && img.startsWith("http")) {
          formData.append("existingImages", img);
        }
      });
    }

    images.forEach((file) => formData.append("images", file));
    try {
      const res = await updatePost(id, formData);
      if (res.data.success) {
        toast.success(res.data.message || "Post updated successfully!");
        navigate("/rep/dashboard");
      } else {
        toast.error(res.data.message || "Failed to update post");
      }
    } catch {
      toast.error("Error updating post");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/loader.gif" alt="Loading..." className="h-16 w-16" />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load product details. Please try again.
      </p>
    );

  if (!post)
    return (
      <p className="text-center text-muted-foreground mt-10">No post found.</p>
    );

  return (
    <PostForm
      onSubmit={handleEditSubmit}
      defaultValues={{
        title: post?.title || "",
        description: post?.description || "",
        brand: post?.brand || "",
        termsOfUse: post?.termsOfUse || "",
        territory: post?.territoryId || "",
        useCases: post?.useCases || [],
        ingredients: post?.ingredients || [],
        existingImages: post.imageUrl || [],
      }}
      heading="Edit Product"
    />
  );
};

export default PostEditPage;
