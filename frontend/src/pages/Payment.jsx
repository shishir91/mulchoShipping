import React, { useEffect, useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/config.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { authState } = useAuth();
  const { userInfo: user, token } = authState;
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        const response = await api.get("/admin/payments", {
          headers: { token },
        });
        if (response.data.success) {
          console.log(response.data);

          setPaymentData(response.data.payments);
        }
      } catch (error) {
        toast.error("Failed to fetch payment data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPaymentData();
  }, [token]);

  let filteredPayment = paymentData.filter(
    (payment) => payment.status === "pending"
  );

  if (status) {
    filteredPayment = paymentData.filter(
      (payment) => payment.status === status
    );
    console.log(filteredPayment);
  }

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-4 flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-2" />
          Payments
        </h2>

        {/* Total Payment Summary */}
        {/* <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Payment
            </h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">
              ${parseFloat(totalIncome).toFixed(2)}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent Income
            </h3>
            {incomeData.filter((income) => income.status === "sent").length >
            0 ? (
              <ul className="mt-2">
                {incomeData
                  .filter((income) => income.status === "sent")
                  .slice(0, 3)
                  .map((income, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span>{income.source[0].productName}</span>
                      <span className="font-medium text-green-600">
                        ${income.source[0].price}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent income found.</p>
            )}
          </div>
        </div> */}

        {/* Detailed Payment List */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Details
          </h3> */}

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => navigate("/payment?status=pending")}
              className={`p-2 px-4 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-teal-700 hover:text-white`}
            >
              PENDING
            </button>
            <button
              onClick={() => navigate("/payment?status=sent")}
              className={`p-2 px-4 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-teal-700 hover:text-white`}
            >
              SENT
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-3">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">From</th>
                  <th className="p-3">Commission Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayment.length > 0 ? (
                  filteredPayment
                    .slice()
                    .reverse()
                    .map((payment, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        key={payment._id}
                        className="border-b"
                        onClick={() =>
                          navigate("/PaymentDetail", { state: payment })
                        }
                      >
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          {new Date(payment.createdAt).toLocaleDateString()}
                          {/* <br /> */}
                          {/* {
                            new Date(payment.createdAt)
                              .toISOString()
                              .split("T")[0]
                          } */}
                        </td>
                        <td className="p-3">
                          {payment.source[0].product[0].productName}
                        </td>
                        <td className="p-3">{payment.to[0].name}</td>
                        <td className="p-3 text-green-600 font-medium">
                          ${payment.source[0].commission}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td className="p-3 text-center" colSpan="5">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
