import { uploadNewProduct } from "../api";
import ProductForm from "./ProductForm";

const ProductAddForm = () => {
  return (
    <div className="flex justify-center items-start bg-amber-50 py-10 gap-6 flex-wrap">
      {/* ------- PROMO/INFO CARD ------- */}
      <div className="md:grid md:grid-cols-2 max-w-4xl bg-white mx-4 md:mx-auto rounded-xl overflow-hidden shadow-sm">
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/promotional/image.png"
          alt="promotional"
          className="hidden md:block w-full max-w-lg object-cover"
        />

        <div className="flex items-center justify-center p-10 text-center">
          <div>
            <h1 className="text-3xl font-bold leading-snug">
              Start adding your{" "}
              <span className="text-blue-600">products today</span>
            </h1>

            <p className="mt-3 text-gray-600 text-sm md:text-base">
              Upload product images, set pricing, choose territory and provide a
              clear description. Good product details help customers trust your
              listings and increase conversions.
            </p>

            <ul className="mt-4 text-gray-700 text-sm space-y-2 text-left mx-auto w-fit">
              <li>• Use high quality product images</li>
              <li>• Clear & short product name works best</li>
              <li>• Add useful description including features/uses</li>
              <li>• Set accurate MRP and PTR for better sales</li>
            </ul>

            <button className="rounded-lg bg-blue-600 text-sm px-14 py-3 mt-6 text-white font-medium hover:bg-blue-700">
              Learn More →
            </button>
          </div>
        </div>
      </div>

      <ProductForm mode="add" submitAction={uploadNewProduct} />
    </div>
  );
};

export default ProductAddForm;
