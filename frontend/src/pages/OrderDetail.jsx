import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config.js";

const OrderDetail = () => {
  const [order, setOrder] = useState(null); // Initialize order state
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchOrder() {
      const response = await api.get(`/order/getOrderDetail/${orderId}`, {
        headers: { token },
      });
      if (response.data.success) {
        setOrder(response.data.order);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Detail</h2>
      {/* Product Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Product Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Product Name:</p>
            <p className="text-gray-500">{order.product[0].productName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Quantity:</p>
            <p className="text-gray-500">{order.qty}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Price:</p>
            <p className="text-gray-500">${order.price}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Status:</p>
            <p className="text-gray-500 capitalize">{order.status}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow sm:col-span-2">
            <p className="font-semibold text-gray-700">Remarks:</p>
            <p className="text-gray-500">{order.remarks}</p>
          </div>
        </div>
      </section>

      {/* Customer Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Customer Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Customer Name:</p>
            <p className="text-gray-500">{order.customerName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-500">{order.customerPhone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow sm:col-span-2">
            <p className="font-semibold text-gray-700">Location:</p>
            <p className="text-gray-500">{order.customerLocation}</p>
          </div>
        </div>
      </section>

      {/* Order From Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order From</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Ordered By:</p>
          <p className="text-gray-500">{order.orderFrom[0]?.name}</p>
        </div>
      </section>

      {/* Timestamps */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Timestamps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Order Created At:</p>
            <p className="text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Last Updated At:</p>
            <p className="text-gray-500">
              {new Date(order.updatedAt).toLocaleDateString()}{" "}
              {new Date(order.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetail;
