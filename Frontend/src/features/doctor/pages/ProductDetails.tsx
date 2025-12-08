import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductDTO } from "../dto/ProductDTO";
import {
  IndianRupee,
  ArrowLeft,
  Package,
  Building2,
  MapPin,
  Tag,
  Percent,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product: ProductDTO = state;

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const [thumbnail, setThumbnail] = React.useState(
    product.imageUrls?.[0] || null
  );

  // Commission calculation (5% commission)
  const commissionPercentage = 5;
  const commissionAmount = (product.ptr * commissionPercentage) / 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Images */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Thumbnail Images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex flex-row sm:flex-col gap-3 order-2 sm:order-1">
                {product.imageUrls.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      thumbnail === image
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 order-1 sm:order-2">
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="w-full h-auto max-h-[600px] object-contain"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="flex-1 lg:max-w-lg">
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Brand */}
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            <span className="text-lg text-gray-700 font-medium">
              {product.brand}
            </span>
          </div>

          {/* Pricing */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 line-through">
                MRP: <IndianRupee className="w-4 h-4 inline" />
                {product.mrp}.00
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                PTR: <IndianRupee className="w-5 h-5 inline" />
                {product.ptr}.00
              </span>
            </div>
            <span className="text-sm text-gray-500">
              (inclusive of all taxes)
            </span>
          </div>

          {/* Territories */}
          {product.territoryNames && product.territoryNames.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Territories
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.territoryNames.map((territory, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {territory}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {product.useCase && product.useCase.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Use Cases
                </h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {product.useCase.map((useCase, index) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients/About Product */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About Product
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Commission Information */}
          <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Your Commission
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Commission Rate:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {commissionPercentage}%
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-green-200">
                <span className="text-gray-700 font-medium">
                  Commission per unit:
                </span>
                <span className="text-2xl font-bold text-green-700 flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  {commissionAmount.toFixed(2)}
                </span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  You will earn{" "}
                  <span className="font-semibold text-green-700">
                    <IndianRupee className="w-3 h-3 inline" />
                    {commissionAmount.toFixed(2)}
                  </span>{" "}
                  for each unit sold at PTR of{" "}
                  <span className="font-semibold">
                    <IndianRupee className="w-3 h-3 inline" />
                    {product.ptr}.00
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
