import React, { useEffect, useState } from "react";
import api from "../api/config";
import { toast, ToastContainer } from "react-toastify";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProductDetail = () => {
  const queryParams = new URLSearchParams(location.search);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const productId = queryParams.get("productId");

  const { authState } = useAuth();
  const { userInfo: user, token } = authState;
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
            autoClose: 2000,
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product details", {
          autoClose: 2000,
          theme: "colored",
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
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Product Details
        </h1>

        {/* Product Name */}
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {product.productName}
        </h2>

        {/* Product Image Slider */}

        <div id="default-carousel" className="relative w-2/3 overflow-hidden">
          {/* Carousel Wrapper */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 50}%)`,
              width: `${product.images.length * 65}%`,
            }}
          >
            {/* Items */}
            {product.images.map((image, index) => (
              <div
                key={index}
                className="h-56 md:h-96 flex-shrink-0"
                style={{ flexBasis: "50%" }}
              >
                <img
                  src={image}
                  className="w-full h-full object-cover rounded-lg"
                  alt={`Product Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Slider Indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full ${
                  activeIndex === index ? "bg-black" : "bg-gray-400"
                }`}
                aria-current={activeIndex === index}
                aria-label={`Slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>

          {/* Slider Controls */}
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handlePrev}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <ArrowLeft className="w-4 h-4 text-white dark:text-gray-800" />
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={handleNext}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <ArrowRight className="w-4 h-4 text-white dark:text-gray-800" />
              <span className="sr-only">Next</span>
            </span>
          </button>
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
          <p className="text-gray-600">
            <strong>Created At:</strong>{" "}
            {new Date(product.createdAt).toLocaleString()}
          </p>
          <p className="text-gray-600">
            <strong>Updated At:</strong>{" "}
            {new Date(product.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
