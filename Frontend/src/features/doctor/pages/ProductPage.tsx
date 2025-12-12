import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Package,
  Phone,
  Building2,
  IndianRupee,
  AlertCircle,
  Search,
} from "lucide-react";
import { RepDTO } from "../dto/RepDTO";
import { ProductDTO } from "../dto/ProductDTO";
import useFetchItem from "@/hooks/useFetchItem";
import { getAllReps, getRepProducts } from "../api";
import { SpinnerButton } from "@/components/shared/SpinnerButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductPage: React.FC = () => {
  const [selectedRep, setSelectedRep] = useState<RepDTO | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: reps,
    loading,
    error,
  } = useFetchItem<RepDTO[] | null>(getAllReps);
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const ingredientsMatch = product.ingredients.some((ing) =>
        ing.toLowerCase().includes(query)
      );

      return nameMatch || brandMatch || ingredientsMatch;
    });
  }, [products, searchQuery]);

  useEffect(() => {
    if (selectedRep) {
      setLoadingProducts(true);
      setSearchQuery(""); // Reset search when selecting a new rep
      getRepProducts(selectedRep.id)
        .then((data) => {
          setProducts(data || []);
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
          toast.error("Failed to load products");
          setProducts([]);
        })
        .finally(() => {
          setLoadingProducts(false);
        });
    } else {
      setProducts([]);
      setSearchQuery(""); // Reset search when no rep is selected
    }
  }, [selectedRep]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerButton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-amber-50">
      {/* Left Side - Reps List */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto no-scrollbar">
        <div className="p-4 border-b border-gray-200 bg-slate-700 text-white sticky top-0 z-10">
          <h1 className="text-xl font-bold">MedMate</h1>
          <p className="text-sm text-blue-100">Connected Representatives</p>
        </div>

        <div className="p-4 space-y-3">
          {reps && reps.length > 0 ? (
            reps.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedRep(rep)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRep?.id === rep.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {rep.image ? (
                    <img
                      src={rep.image}
                      alt={rep.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {rep.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-600 truncate">
                        {rep.company}
                      </p>
                    </div>
                    {rep.departmentName && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {rep.departmentName}
                      </p>
                    )}
                    {selectedRep?.id === rep.id && (
                      <span className="text-xs font-medium text-blue-600 mt-2 inline-block">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No connected representatives</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Products */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!selectedRep ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                Select a representative to view their products
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Rep Details Header */}
            <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-3">
                  {selectedRep.image ? (
                    <img
                      src={selectedRep.image}
                      alt={selectedRep.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedRep.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{selectedRep.company}</span>
                      </div>
                      {selectedRep.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{selectedRep.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="p-6">
              <div className="max-w-6xl mx-auto">
                {loadingProducts ? (
                  <div className="flex justify-center items-center py-20">
                    <SpinnerButton />
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Available Products ({products.length})
                      </h3>

                      {/* Search Bar */}
                      <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search products by name, brand, or ingredients..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                          >
                            {/* Product Image */}
                            {product.imageUrls &&
                            product.imageUrls.length > 0 ? (
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-3"
                              />
                            ) : (
                              <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                                <Package className="w-12 h-12 text-gray-400" />
                              </div>
                            )}

                            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Brand: {product.brand}
                            </p>

                            {/* Ingredients */}
                            {product.ingredients &&
                              product.ingredients.length > 0 && (
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                                  {product.ingredients[0]}
                                  {product.ingredients.length > 1 && "..."}
                                </p>
                              )}

                            {/* Pricing */}
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">MRP:</span>
                                <IndianRupee className="w-4 h-4" />
                                <span className="font-medium text-gray-900">
                                  {product.mrp}.00
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">PTR:</span>
                                <IndianRupee className="w-4 h-4" />
                                <span className="font-medium text-blue-600">
                                  {product.ptr}.00
                                </span>
                              </div>
                            </div>

                            <button
                              className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors text-sm font-medium"
                              onClick={() =>
                                navigate(`/doctor/practice/product/details`, {
                                  state: product,
                                })
                              }
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Search className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium">
                          No products found matching "{searchQuery}"
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try searching with different keywords
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="bg-yellow-50 rounded-full p-6 mb-4">
                      <AlertCircle className="w-16 h-16 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Products Available
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      {selectedRep.name} hasn't added any products yet. Check
                      back later or contact them directly.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
