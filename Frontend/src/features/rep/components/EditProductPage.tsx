import { useLocation } from "react-router-dom";
import ProductForm from "./ProductForm";
import { editProduct } from "../api";

export default function EditProductPage() {
  const { state: product } = useLocation();

  return (
    <div className="flex justify-center bg-amber-50 py-10">
      <ProductForm
        mode="edit"
        initialData={product}
        submitAction={(formData) => editProduct(product.id, formData)}
      />
    </div>
  );
}
