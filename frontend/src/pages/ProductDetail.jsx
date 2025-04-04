import React, { useEffect, useState } from "react";
import api from "../api/config";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const ProductDetail = () => {
  const queryParams = new URLSearchParams(location.search);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productId = queryParams.get("productId");
  const { authState } = useAuth();
  const { token } = authState;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/product?id=${productId}`, {
          headers: { token },
        });
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          toast.error(response.data.message, {
            duration: 2000,
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product details", {
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">
            Failed to load product details.
          </p>
        </div>
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      {loading && <Loading />}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Product Details
        </h1>

        {/* Product Name */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {product.productName}
        </h2>

        {/* Product Image Slider */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-lg shadow-lg">
          {/* Carousel Wrapper */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {product?.images?.map((image, index) => (
              <div
                key={index}
                className="min-w-full flex justify-center items-center"
              >
                <img
                  src={image}
                  className="w-full h-64 object-contain rounded-lg"
                  alt={`Product Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Slider Controls */}
          <button
            className="absolute cursor-pointer top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            onClick={handlePrev}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            className="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            onClick={handleNext}
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Dots Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {product?.images?.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 cursor-pointer rounded-full transition-all duration-300 ${
                  activeIndex === index ? "bg-white scale-125" : "bg-gray-400"
                }`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-2">
          <p className="text-gray-600">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="text-gray-600">
            <strong>Price:</strong> NPR {product.price}
          </p>
          <p className="text-gray-600">
            <strong>Commission Rate:</strong> {product.commissionRate}%
          </p>
          <p className="text-gray-600">
            <strong>Commission:</strong> NPR {product.commission}
          </p>
          <p className="text-gray-600">
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-sm font-medium rounded-md ${
                product.status === "available"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </p>
          {/* <p className="text-gray-600">
            <strong>Created At:</strong>{" "}
            {new Date(product.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Updated At:</strong>{" "}
            {new Date(product.updatedAt).toLocaleString()}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
