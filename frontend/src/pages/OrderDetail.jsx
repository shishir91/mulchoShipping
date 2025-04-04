import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";

const OrderDetail = () => {
  const [order, setOrder] = useState(null); // Initialize order state
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Initialize loading state

  const { authState } = useAuth();
  const { token } = authState;
  useEffect(() => {
    async function fetchOrder() {
      setIsLoading(true); // Set loading state to true before fetching
      try {
        const response = await api.get(`/order/getOrderDetail/${orderId}`, {
          headers: { token },
        });
        if (response.data.success) {
          console.log(response.data.order);
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    }
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 sm:p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      {isLoading && <Loading />}

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Detail</h2>

      {/* Product Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Product Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {[
            { label: "Product Name", value: order.product.productName },
            { label: "Quantity", value: order.qty },
            { label: "Product Price", value: `Rs. ${order.product.price}` },
            { label: "Order Price", value: `Rs. ${order.price}` },
            {
              label: "Product Commission Rate",
              value: `${order.product.commissionRate} %`,
            },
            {
              label: "Order Commission Rate",
              value: `${order.commissionRate} %`,
            },
            {
              label: "Base Commission",
              value: `Rs. ${order.product.commission}`,
            },
            { label: "Total Commission", value: `Rs. ${order.commission}` },
            { label: "Status", value: order.status, extra: "capitalize" },
            { label: "Remarks", value: order.remarks },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow break-words"
            >
              <p className="font-semibold text-gray-700">{item.label}:</p>
              <p className={`text-gray-500 ${item.extra || ""}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Customer Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow break-words">
            <p className="font-semibold text-gray-700">Customer Name:</p>
            <p className="text-gray-500">{order.customerName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow break-words">
            <p className="font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-500">{order.customerPhone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow break-words sm:col-span-2">
            <p className="font-semibold text-gray-700">Location:</p>
            <p className="text-gray-500">{order.customerLocation}</p>
          </div>
        </div>
      </section>

      {/* Order From Details */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order From</h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow break-words">
          <p className="font-semibold text-gray-700">Ordered By:</p>
          <p className="text-gray-500">{order.orderFrom?.name}</p>
        </div>
      </section>

      {/* Timestamps */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Timestamps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow break-words">
            <p className="font-semibold text-gray-700">Order Created At:</p>
            <p className="text-gray-500">
              {new Date(order.createdAt).toISOString().split("T")[0]}{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow break-words">
            <p className="font-semibold text-gray-700">Last Updated At:</p>
            <p className="text-gray-500">
              {new Date(order.updatedAt).toISOString().split("T")[0]}{" "}
              {new Date(order.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderDetail;
