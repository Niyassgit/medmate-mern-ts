import { useLocation } from "react-router-dom";
import ProductForm from "./ProductForm";
import { editProduct } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const product = state?.product || state;
  const productId = product?.id || state?.id;

  if (!product || !productId) {
    toast.error("Product data not found");
    navigate(-1);
    return null;
  }

  return (
    <div className="flex justify-center bg-amber-50 py-10">
      <ProductForm
        mode="edit"
        initialData={product}
        submitAction={async (formData) => {
          try {
            const result = await editProduct(productId, formData);
            return result;
          } catch (error) {
            console.error("Edit product error:", error);
            throw error;
          }
        }}
      />
    </div>
  );
}
