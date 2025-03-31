import React, { useState, useEffect } from "react";
import { ShoppingBag, Tag, HandCoins, ShoppingCart } from "lucide-react";
import api from "../api/config.js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MyProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { authState } = useAuth();
  const { userInfo: user, token } = authState;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/product/getMyProduct", {
          headers: { token },
        });
        if (response.data.success) {
          setProducts(response.data.myProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRemoveProduct = async (productId) => {
    try {
      setIsLoading(true);
      const response = await api.put(
        `/product/removeMyProduct?id=${productId}`,
        null,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => window.location.reload(),
        });
      }
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      {isLoading && <Loading />}

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold flex items-center">
            <ShoppingBag className="h-8 w-8 text-blue-500 mr-3" />
            My Products
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-600"
          >
            <ShoppingCart className="h-5 w-5 mr-3 " />
            All Products
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {!isLoading && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="relative border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {product.productName}
                </h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-2" />
                  Rs. {product.price}
                </p>
                <p className="text-gray-600 mb-4 flex items-center">
                  <HandCoins className="h-5 w-5 text-gray-400 mr-2" /> Rs.{" "}
                  {product.commission}
                </p>
                {user.role === "user" && (
                  <button
                    onClick={() => handleRemoveProduct(product._id)}
                    className="w-full bg-green-700 mb-1 text-white py-2 rounded-md flex items-center justify-center hover:bg-green-900"
                  >
                    Remove from My Product
                  </button>
                )}
                <button
                  onClick={() =>
                    navigate(`/productDetail?productId=${product._id}`)
                  }
                  className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              {isLoading ? "Loading products..." : "No products available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
