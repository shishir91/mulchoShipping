import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentDetail = () => {
  const location = useLocation();
  const [payment, setPayment] = useState(location.state);

  useEffect(() => {
    if (location.state) {
      setPayment(location.state);
    }
  }, [location.state]);

  console.log(payment);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Detail</h2>
      {/* Product Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Product Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Product Name:</p>
            <p className="text-gray-500">{payment.source[0].productName}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Quantity:</p>
            <p className="text-gray-500">{payment.source[0].qty}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Price:</p>
            <p className="text-gray-500">${payment.source[0].price}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Customer Name:</p>
            <p className="text-gray-500">{payment.source[0].customerName}</p>
          </div>
        </div>
      </section>
      {/* User Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Name:</p>
            <p className="text-gray-500">{payment.to[0].name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Email:</p>
            <p className="text-gray-500">{payment.to[0].email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-500">{payment.to[0].phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Facebook:</p>
            <p className="text-gray-500">{payment.to[0].fb}</p>
          </div>
        </div>
      </section>
      {/* Payment Method */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Commission Amount:</p>
            <p className="text-gray-500">${payment.amount}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <button
              onClick={() => {}}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold mx-4 py-2 px-4 rounded-lg shadow"
            >
              Payment Done
            </button> 
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow col-span-1 sm:col-span-2">
          <img
            src={payment.to[0].payment}
            alt="Payment QR"
            className="rounded-lg mt-2 max-w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
};

export default PaymentDetail;
