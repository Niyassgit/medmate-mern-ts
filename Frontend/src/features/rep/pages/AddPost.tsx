import { useNavigate } from "react-router-dom";
import {
  ProductPostFormValues,
} from "../schemas/ProductPostSchema";
import { addPost } from "../api";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import PostForm from "../components/PostFormProps";

const AddPost = () => {
   const navigate = useNavigate();
  const id = useSelector((state: any) => state.auth.user?.id);

  const handleSubmit = async (values: ProductPostFormValues, images: File[]) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    images.forEach(file => formData.append("images", file));

    try {
      const res = await addPost(id, formData);
      if (res.data.success) {
        toast.success(res.data.message || "Post uploaded successfully");
        navigate("/rep/dashboard");
      }
    } catch (err) {
      toast.error("Failed to add post");
    }
  };

  return (
   <PostForm onSubmit={handleSubmit} heading="Add New Product"/>
  );
 
};

export default AddPost;
