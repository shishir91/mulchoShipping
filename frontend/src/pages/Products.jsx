import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Tag,
  EllipsisVertical,
  Plus,
  HandCoins,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import api from "../api/config.js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modelStatus, setModelStatus] = useState("");
  const [modelProductId, setModelProductId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (productId) => {
    setDropdownOpen(dropdownOpen === productId ? null : productId);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await api.get("/product", {
          headers: { token },
        });
        setIsLoading(false);
        if (response.data.success) {
          console.log(response.data);

          setProducts(response.data.products);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleChangeProductStatus = async (productId, status) => {
    try {
      setIsLoading(true);
      const response = await api.post(
        `/admin/changeProductStatus?id=${productId}`,
        { status },
        { headers: { token } }
      );
      setIsLoading(false);
      console.log(response);
      if (response.data.success) {
        setShowModal(false);
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => window.location.reload(),
        });
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      setShowModal(false);
      toast.error(e, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/admin/products?id=${productId}`, {
        headers: { token },
      });
      setIsLoading(false);
      console.log(response);
      if (response.data.success) {
        setShowModal(false);
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => window.location.reload(),
        });
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      setShowModal(false);
      toast.error(e, {
        autoClose: 2000,
        theme: "colored",
      });
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
            Products
          </h2>
          {user.role == "admin" && (
            <button
              onClick={() => navigate("/addProduct")}
              className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-blue-600"
            >
              <Plus className="h-5 w-5 mr-3 " />
              Add Product
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="relative border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                {user.role === "admin" && (
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <EllipsisVertical
                        className="h-6 w-6 text-gray-500 cursor-pointer"
                        onClick={() => toggleDropdown(product._id)}
                      />
                      {dropdownOpen === product._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                            onClick={() => navigate("/editProduct")}
                          >
                            <Pencil className="h-5 w-5 mr-2 text-gray-500" />
                            Edit Product
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                            onClick={() => {
                              console.log("Change Status:", product);
                              setShowModal(true);
                              setModelProductId(product._id);
                              {
                                product.status == "available"
                                  ? setModelStatus("out-of-stock")
                                  : setModelStatus("available");
                              }
                            }}
                          >
                            <SlidersHorizontal className="h-5 w-5 mr-2 text-gray-500" />
                            {product.status == "available"
                              ? "Out-Of-Stock"
                              : "Available"}
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 flex items-center"
                            onClick={() => {
                              setShowModal(true);
                              setModelStatus("delete");
                              setModelProductId(product._id);
                            }}
                          >
                            <Trash2 className="h-5 w-5 mr-2 text-red-500" />
                            Delete Product
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Image */}
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
                <button className="w-full bg-blue-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-blue-600">
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No products available.
            </p>
          )}

          {/* Model */}
          {showModal &&
            (modelStatus == "delete" ? (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Delete Product</h2>
                  <p className="text-gray-600 mb-2">
                    Are you sure you want to delete this product?
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowModal(false)} // Close modal
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(modelProductId)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Change Product Status
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {modelStatus == "available"
                      ? "Are you sure this product is available?"
                      : "Are you sure this product is out-of-stock?"}
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setShowModal(false)} // Close modal
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
                    >
                      No
                    </button>
                    <button
                      onClick={() =>
                        handleChangeProductStatus(modelProductId, modelStatus)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
