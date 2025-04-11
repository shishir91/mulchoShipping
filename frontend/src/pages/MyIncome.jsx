import React, { useEffect, useState } from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import api from "../api/config.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";
import PaymentModal from "../components/PaymentModal.jsx";

const MyIncome = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { authState } = useAuth();
  const { token } = authState;
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    async function fetchIncomeData() {
      try {
        const response = await api.get("/user/getIncome", {
          headers: { token },
        });
        if (response.data.success) {
          setIncomeData(response.data.income);
          setTotalIncome(
            response.data.income
              .filter((income) => income.status === "sent")
              .reduce((acc, item) => {
                return acc + item.source.commission;
              }, 0)
          );
        }
      } catch (error) {
        toast.error("Failed to fetch income data.");
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchPaymentData() {
      try {
        const response = await api.get("/payment/getPaymentList", {
          headers: { token },
        });
        console.log(response.data);
        setPaymentList(response.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    }
    fetchIncomeData();
    fetchPaymentData();
  }, [token]);

  let filteredIncome = incomeData.filter((income) => income.status === "sent");

  if (status) {
    filteredIncome = incomeData.filter((income) => income.status === status);
  }

  return (
    <div className="p-4 sm:ml-64 mt-4">
      {isLoading && <Loading />}

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-2" />
            My Income
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-orange-500 cursor-pointer text-white font-medium px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Payment Request
          </button>
        </div>

        {/* Total Income Summary */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Income
            </h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">
              Rs. {parseFloat(totalIncome).toFixed(2)}
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
                      <span>{income.source.product.productName}</span>
                      <span className="font-medium text-green-600">
                        Rs. {income.source.commission}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No recent income found.</p>
            )}
          </div>
        </div>

        {/* Detailed Income List */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Income Details
          </h3>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => navigate("/income?status=sent")}
              className={`p-2 px-4 cursor-pointer rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-teal-700 hover:text-white ${
                !status || status == "sent"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              RECEIVED
            </button>
            <button
              onClick={() => navigate("/income?status=pending")}
              className={`p-2 px-4 cursor-pointer rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-teal-700 hover:text-white ${
                status == "pending"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              PENDING
            </button>
            <button
              onClick={() => navigate("/income?status=payment")}
              className={`p-2 px-4 cursor-pointer rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-teal-700 hover:text-white ${
                status == "payment"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              PAYMENT
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-3">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {status === "payment" && paymentList.length > 0 ? (
                  paymentList.map((payment, index) => (
                    <tr key={payment._id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {
                          new Date(payment.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="p-3">{payment.orders.length} Items</td>
                      <td className="p-3 text-green-600 font-medium">
                        Rs. {payment.amount}
                      </td>
                    </tr>
                  ))
                ) : filteredIncome.length > 0 ? (
                  filteredIncome.map((income, index) => (
                    <tr key={income._id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {new Date(income.createdAt).toISOString().split("T")[0]}
                      </td>
                      <td className="p-3">
                        {income.source.product.productName}
                      </td>
                      <td className="p-3 text-green-600 font-medium">
                        Rs. {income.source.commission}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 text-center" colSpan="4">
                      No income records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <PaymentModal
          showModal={showModal}
          setShowModal={setShowModal}
          incomeData={incomeData}
        />
      )}
    </div>
  );
};

export default MyIncome;
