import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentDetail = () => {
  const location = useLocation();
  const [payment, setPayment] = useState(location.state);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setPayment(location.state);
    }
  }, [location.state]);

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
            <p className="text-gray-500">
              {payment.source.product.productName}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Quantity:</p>
            <p className="text-gray-500">{payment.source.qty}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Product Price:</p>
            <p className="text-gray-500">
              ${payment.source.product.price}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Order Price:</p>
            <p className="text-gray-500">${payment.source.price}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow sm:col-span-2">
            <p className="font-semibold text-gray-700">Customer Name:</p>
            <p className="text-gray-500">{payment.source.customerName}</p>
          </div>
        </div>
      </section>
      {/* User Details */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">User Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Name:</p>
            <p className="text-gray-500">{payment.to.name}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Email:</p>
            <p className="text-gray-500">{payment.to.email}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Phone:</p>
            <p className="text-gray-500">{payment.to.phone}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Facebook:</p>
            <p className="text-gray-500">{payment.to.fb}</p>
          </div>
        </div>
      </section>
      {/* Payment Method */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code</h2>
        <div className="flex items-center justify-between mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <p className="font-semibold text-gray-700">Commission Amount:</p>
            <p className="text-gray-500">${payment.source.commission}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold mx-4 py-2 px-4 rounded-lg shadow"
            >
              Payment Done
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow col-span-1 sm:col-span-2">
          <img
            src={payment.to.payment}
            alt="Payment QR"
            className="rounded-lg mt-2 max-w-full h-auto"
          />
        </div>
      </section>

      {/* //Modal */}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Upload Proof ScreenShot
            </h2>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button className="bg-green-500 cursor-pointer hover:bg-green-600 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
