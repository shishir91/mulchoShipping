import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import api from "../api/config.js";

const MyIncome = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  //   useEffect(() => {
  //     async function fetchIncomeData() {
  //       try {
  //         const response = await api.get("/income/getIncomeDetails", {
  //           headers: { token },
  //         });
  //         if (response.data.success) {
  //           setIncomeData(response.data.income);
  //           setTotalIncome(
  //             response.data.income.reduce((acc, item) => acc + item.amount, 0)
  //           );
  //         }
  //       } catch (error) {
  //         toast.error("Failed to fetch income data.");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //     fetchIncomeData();
  //   }, [token]);

  //   if (isLoading) {
  //     return <div className="text-center">Loading...</div>;
  //   }

  return (
    <div className="p-4 sm:ml-64 mt-4">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-semibold mb-4 flex items-center">
          <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-2" />
          My Income
        </h2>

        {/* Total Income Summary */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Income
            </h3>
            <p className="text-2xl font-bold text-blue-500 mt-2">
              ${totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Recent Income
            </h3>
            {incomeData.length > 0 ? (
              <ul className="mt-2">
                {incomeData.slice(0, 3).map((income, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2 border-b"
                  >
                    <span>{income.source}</span>
                    <span className="font-medium text-green-600">
                      ${income.amount.toFixed(2)}
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

          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-3">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {incomeData.length > 0 ? (
                  incomeData.map((income, index) => (
                    <tr key={income._id} className="border-b">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {new Date(income.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{income.source}</td>
                      <td className="p-3 text-green-600 font-medium">
                        ${income.amount.toFixed(2)}
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
    </div>
  );
};

export default MyIncome;
