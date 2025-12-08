import React from "react";
import { ProductDTO } from "../dto/ProductDTO";
import { IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: ProductDTO;
  id: string;
}

const ProductCard = ({ product, id }: ProductCardProps) => {
    const navigate=useNavigate()
  return (
    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 max-w-[650px]">

      {/* Product Image */}
      <img
        className="w-full md:w-56 h-64 object-cover object-top"
        src={product.imageUrls?.[0] || "/no-image.jpg"}
        alt={product.name}
      />

      {/* Content */}
      <div className="p-5 flex flex-col justify-between w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-800 line-clamp-1">
            {product.name}
          </h3>

          <span className="px-2.5 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
            SALE
          </span>
        </div>

        {/* Ingredients */}
        <p className="text-sm mt-2 text-slate-500 line-clamp-2">
          {product.ingredients?.[0] || "No ingredients added"}...
        </p>

        {/* Pricing */}
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            MRP: <IndianRupee className="w-4 h-4" /> {product.mrp}.00
          </p>

          <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
            PTR: <IndianRupee className="w-4 h-4" /> {product.ptr}.00
          </p>
        </div>

        {/* Edit Button */}
        <button className="px-10 py-2 bg-slate-800 hover:bg-slate-900 transition text-white text-sm rounded-lg mt-6 self-start"
        onClick={()=>navigate(`/rep/business/product/edit-product`,{state:product})}
        >
          Edit Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
