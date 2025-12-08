import ProductCard from "../components/ProductCard";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import useFetchItem from "@/hooks/useFetchItem";
import { getProducts } from "../api";
import { Spinner } from "@/components/ui/spinner";
import { ProductDTO } from "../dto/ProductDTO";

const Product = () => {
  const navigate = useNavigate();
  const {
    data: products,
    loading,
    error,
  } = useFetchItem<ProductDTO[] | null>(getProducts);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="bg-amber-50">
      {/* HERO CARD CENTERED */}
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row items-center justify-around text-sm border border-gray-200 rounded-2xl m-2 max-w-5xl w-full bg-white">
          <div className="flex flex-col text-center md:text-left items-center md:items-start pt-14 md:p-10">
            <h2 className="md:text-4xl text-2xl font-bold text-gray-800">
              Boost your productivity.
              <br />
              Add New Products
            </h2>

            <div className="flex items-center gap-4 mt-6">
              <button
                className="bg-slate-800 hover:bg-slate-950 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all"
                onClick={() => navigate(`/rep/business/product/upload`)}
              >
                Add New Product
              </button>
              <button className="group flex items-center gap-2 px-7 py-2.5 active:scale-95 transition">
                Learn more
                <svg
                  className="mt-1 group-hover:translate-x-0.5 transition-all"
                  width="15"
                  height="11"
                >
                  <path
                    d="M1 5.5h13.092M8.949 1l5.143 4.5L8.949 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <img
            className="max-w-[375px] pt-10 md:p-0"
            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/appDownload/excitedWomenImage.png"
          />
        </div>
      </div>

      {/* PRODUCT CARD */}
      <div className="flex items-center justify-center mt-6 ">
        <Card className="w-[70%] bg-gray-50 flex items-center">
          {products
            ? products.map((item) => (
                <ProductCard product={item} id={item.id} />
              ))
            : "Not found"}
        </Card>
      </div>
    </div>
  );
};

export default Product;
