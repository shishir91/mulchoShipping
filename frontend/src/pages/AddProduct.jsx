import React, { useState } from "react";
import api from "../api/config.js";
import { ToastContainer, toast } from "react-toastify";
import {
  TagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  PhotoIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    commissionRate: "",
    commission: "",
    price: "",
    description: "",
  });
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { authState } = useAuth();
  const { userInfo: user, token } = authState;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "commissionRate" && prevData.price) {
        updatedData.commission = (
          (parseFloat(value) / 100) *
          parseFloat(prevData.price)
        ).toFixed(2);
      }

      return updatedData;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [
      ...prevImages,
      ...files.filter((file) => !prevImages.includes(file)),
    ]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    console.log("Selected images:", images);

    const formPayload = new FormData();
    images.forEach((image) => formPayload.append("productImages", image)); // Append files

    // Add other fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      setIsLoading(true);
      const response = await api.post("/admin/addProduct", formPayload, {
        headers: {
          token, // Add your token
          "Content-Type": "multipart/form-data", // Ensure this header is set
        },
      });
      setIsLoading(false);
      console.log("Response:", response.data);
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            navigate("/products");
          },
        });
      } else {
        toast.error(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting form:", error);
      toast.error(error.message, {
        autoClose: 2000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      {isLoading && <Loading />}

      <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
          Add Product
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Product Name</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter product name"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Commission Rate */}
          <div className="mb-4">
            <label className="block text-gray-700">Commission Rate (%)</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter commission rate"
              />
            </div>
          </div>

          {/* Commission */}
          <div className="mb-4">
            <label className="block text-gray-700">Commission (Rs.)</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                name="commission"
                value={formData.commission}
                // onChange={handleChange}
                disabled
                required
                className="w-full p-1 outline-none cursor-not-allowed"
                placeholder="Enter commission"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-1 outline-none"
                placeholder="Enter product description"
                rows={1}
              />
            </div>
          </div>

          {/* Product Images */}
          <div className="mb-4">
            <label className="block text-gray-700">Product Images</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-1 outline-none"
                required
              />
            </div>
          </div>

          {/* Display Selected Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <XCircleIcon
                    onClick={() => handleImageRemove(index)}
                    className="h-6 w-6 text-red-500 absolute top-1 right-1 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 text-white mr-2" />
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
