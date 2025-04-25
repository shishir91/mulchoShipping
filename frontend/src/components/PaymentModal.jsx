import { useState } from "react";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import api from "../api/config.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ showModal, setShowModal, incomeData, paymentList }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const { authState } = useAuth();
  const { token } = authState;
  const navigate = useNavigate();

  console.log(paymentList);
  // Filter pending incomes older than 7 days
  // const filteredIncomes = incomeData.filter((income) => {
  //   return dayjs().diff(dayjs(income.deliveredDate), "day") >= 7;
  // });

  // Step 1: Get all order IDs already used in paymentList
  const paidOrderIds = new Set(
    paymentList.flatMap((payment) => payment.orders)
  );

  // Step 2: Filter incomes based on delivery date AND not in paidOrderIds
  const filteredIncomes = incomeData.filter((income) => {
    const isOlderThan7Days =
      dayjs().diff(dayjs(income.deliveredDate), "day") >= 7;
    const isNotAlreadyPaid = !paidOrderIds.has(income._id.toString());

    return isOlderThan7Days && isNotAlreadyPaid;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRequest = async () => {
    try {
      console.log("Requesting payment for:", selectedIds);

      const res = await api.post(
        "/payment/requestPayment",
        { selectedIds },
        {
          headers: {
            token,
          },
        }
      );

      console.log("Payment request successful:", res.data);

      toast.success("Payment request sent successfully!");
      // refetchData();

      setShowModal(false);
      setSelectedIds([]); // Reset selection after request
    } catch (err) {
      console.error(
        "Payment request failed:",
        err.response?.data || err.message
      );
      toast.error(err.response?.data?.message || "Payment request failed");
    }
  };
  console.log("Filtered Incomes:", filteredIncomes);
  return (
    showModal && (
      <div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-2">Payment Request</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select to request payment
          </p>

          <div className="overflow-x-auto max-h-80 mb-4">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">Item</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Total Amount</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((income) => (
                  <tr
                    key={income._id}
                    className="border-b cursor-pointer hover:bg-gray-300"
                    onClick={() =>
                      navigate(`/orderDetail?orderId=${income._id}`)
                    }
                  >
                    <td className="p-2">
                      {dayjs(income.deliveredDate).format("YYYY-MM-DD")}
                    </td>
                    <td className="p-2"> {income.product.productName}</td>
                    <td className="p-2">{income.customerName}</td>
                    <td className="p-2">
                      Rs.{" "}
                      {parseFloat(
                        parseFloat(income.commission) * parseFloat(income.qty)
                      ).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <Button
                        variant={
                          selectedIds.includes(income._id)
                            ? "contained"
                            : "outlined"
                        }
                        size="small"
                        onClick={() => toggleSelect(income._id)}
                      >
                        {selectedIds.includes(income._id)
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredIncomes.length > 0 ? (
            <>
              <div className="flex justify-between mb-4">
                <Button
                  variant="outlined"
                  onClick={() =>
                    selectedIds.length === 0
                      ? setSelectedIds(filteredIncomes.map((i) => i._id))
                      : setSelectedIds([])
                  }
                >
                  {selectedIds.length === 0 ? "Select All" : "Unselect All"}
                </Button>

                <span className="text-sm text-gray-500 self-center">
                  {selectedIds.length} selected
                </span>
              </div>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRequest}
              >
                Request
              </Button>
            </>
          ) : (
            <p className="text-gray-500">
              No pending incomes older than 7 days.
            </p>
          )}

          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black text-3xl"
          >
            &times;
          </button>
        </div>
      </div>
    )
  );
};

export default PaymentModal;
