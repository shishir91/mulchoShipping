import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  ShoppingCartIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  TagIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import api from "../api/config.js";

const EditOrder = () => {
  const [order, setOrder] = useState({});
  const [formData, setFormData] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      const response = await api.get(`/order/getOrderDetail/${orderId}`, {
        headers: { token },
      });
      if (response.data.success) {
        console.log(response);

        setFormData(response.data.order);
      }
    }
    fetchOrder();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await api.put(`/order/editOrder/${orderId}`, formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => navigate("/orders"),
        });
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("An error occurred while updating the order");
    }
  };

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <PlusIcon className="h-6 w-6 text-blue-500 mr-2" />
          Edit Order
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
                value={formData.productName || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter product name"
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="qty"
                value={formData.qty || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter price"
              />
            </div>
          </div>

          {/* Customer Name */}
          <div className="mb-4">
            <label className="block text-gray-700">Customer Name</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer name"
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div className="mb-4">
            <label className="block text-gray-700">Customer Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer phone number"
              />
            </div>
          </div>

          {/* Customer Location */}
          <div className="mb-4">
            <label className="block text-gray-700">Customer Location</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                name="customerLocation"
                value={formData.customerLocation || ""}
                onChange={handleChange}
                required
                className="w-full p-1 outline-none"
                placeholder="Enter customer location"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-gray-700">Remarks (Optional)</label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
              <textarea
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
                className="w-full p-1 outline-none"
                placeholder="Enter remarks (optional)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="h-5 w-5 text-white mr-2" />
            Edit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
