import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import api from "../api/config.js";
import Loading from "../components/Loading.jsx";

const Order = () => {
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false); // to toggle the status dropdown
  const [userOrders, setUserOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  let filteredOrders;

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const order = queryParams.get("order"); // e.g., 'confirmed'

  const allStatus = [
    { name: "All ORDERS", id: "all" },
    { name: "CONFIRMED", id: "confirmed" },
    { name: "IN-PROCESS", id: "inProcess" },
    { name: "DELIVERED", id: "delivered" },
    { name: "EXCHANGED", id: "exchanged" },
    { name: "RETURNED", id: "returned" },
    { name: "CANCELLED", id: "cancelled" },
  ];

  const fetchUserOrders = async () => {
    const response = await api.get("/order/getMyOrders", {
      headers: { token },
    });
    if (response.data.success) {
      setUserOrders(response.data.myOrders);
    }
  };

  const fetchAllOrders = async () => {
    const response = await api.get("/admin/orders", {
      headers: { token },
    });
    if (response.data.success) {
      setUserOrders(response.data.orders);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      if (user.role == "admin") {
        fetchAllOrders();
        hasFetched.current = true;
      } else {
        fetchUserOrders();
        hasFetched.current = true;
      }
    }
  }, [userOrders]);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.put(
        `/order/cancelOrder/${orderId}`,
        {},
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
          onClose: () => {
            setShowModal(false);
            // Re-fetch orders after cancellation
            user.role === "admin" ? fetchAllOrders() : fetchUserOrders();
            navigate("/orders");
          },
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  if (order) {
    console.log(order);
    filteredOrders = userOrders.filter((orders) => orders.status === order);
    console.log(filteredOrders);
  }

  const handleRightClick = (e, orderId) => {
    e.preventDefault(); // Prevent the browser default right-click menu
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      orderId,
    });
  };

  // Hide context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle actions on context menu click
  const handleContextMenuAction = (action, orderId) => {
    setContextMenu(null);
    switch (action) {
      case "view":
        navigate(`/orderDetail?orderId=${orderId}`);
        break;
      case "edit":
        navigate(`/editOrder?orderId=${orderId}`);
        break;
      default:
        break;
    }
  };

  const handleStatusChange = async (status, orderId) => {
    setIsLoading(true);
    console.log(`Changing order ${orderId} to status: ${status}`);
    const response = await api.put(
      "/admin/changeOrderStatus",
      { orderId, status },
      { headers: { token } }
    );
    setIsLoading(false);
    if (response.data.success) {
      toast.success(response.data.message, {
        autoClose: 2000,
        theme: "colored",
        onClose: () => {
          // Re-fetch orders after cancellation
          setContextMenu(null);
          user.role === "admin" ? fetchAllOrders() : fetchUserOrders();
          navigate(`/orders?order=${status}`);
        },
      });
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <ToastContainer />
      <div className="p-6">
        {isLoading && <Loading />}
        {/* Filters Section */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by Product Name / Customer Name"
            className="w-full p-2 border border-gray-300 rounded-md w-1/3"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-4 mb-4">
          {allStatus.map((status, index) => (
            <button
              onClick={() => navigate(`/orders?order=${status.id}`)}
              key={index}
              className={`p-2 px-4 rounded-md text-sm ${
                order
                  ? status.id == order
                    ? "bg-teal-700 text-white"
                    : "bg-gray-200 text-gray-700"
                  : status.id == "all"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.name}
            </button>
          ))}
          {user.role === "user" && user.status === "active" && user.isUserVerified && (
            <button
              onClick={() => navigate("/addOrder")}
              className={"p-2 px-4 rounded-md text-sm bg-blue-500 text-white"}
            >
              Add New Order
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2 border-b border-gray-300">S.N.</th>
                <th className="p-2 border-b border-gray-300">DATE</th>
                <th className="p-2 border-b border-gray-300">PRODUCT NAME</th>
                <th className="p-2 border-b border-gray-300">QTY</th>
                <th className="p-2 border-b border-gray-300">PRICE</th>
                <th className="p-2 border-b border-gray-300">
                  CUSTOMER DETAILS
                </th>
                {(!order || order == "all") && (
                  <th className="p-2 border-b border-gray-300">STATUS</th>
                )}
                <th className="p-2 border-b border-gray-300">REMARKS</th>
                {user.role === "admin" && (
                  <th className="p-2 border-b border-gray-300">Order From</th>
                )}
                {order == "confirmed" && user.role !== "admin" && (
                  <th className="p-2 border-b border-gray-300">ACTION</th>
                )}
              </tr>
            </thead>
            <tbody>
              {!order || order == "all"
                ? userOrders
                    .slice()
                    .reverse()
                    .map((ord, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/orderDetail?orderId=${ord._id}`)
                        }
                        className="cursor-pointer"
                      >
                        <td className="p-2 border-b border-gray-300">
                          {index + 1}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {new Date(ord.createdAt).toISOString().split("T")[0]}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.productName}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.qty}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.price}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.customerName}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.status}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.remarks}
                        </td>
                        {user.role === "admin" && (
                          <td className="p-2 border-b border-gray-300">
                            {ord.orderFrom[0].name}
                          </td>
                        )}
                      </tr>
                    ))
                : filteredOrders
                    .slice()
                    .reverse()
                    .map((ord, index) => (
                      <tr
                        key={index}
                        onClick={() =>
                          navigate(`/orderDetail?orderId=${ord._id}`)
                        }
                        className="cursor-pointer"
                        onContextMenu={(e) =>
                          user.role === "admin" && handleRightClick(e, ord._id)
                        }
                      >
                        <td className="p-2 border-b border-gray-300">
                          {index + 1}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {new Date(ord.createdAt).toISOString().split("T")[0]}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.productName}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.qty}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.price}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.customerName}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.remarks}
                        </td>
                        {user.role === "admin" && (
                          <td className="p-2 border-b border-gray-300">
                            {ord.orderFrom[0].name}
                          </td>
                        )}
                        {ord.status == "confirmed" && user.role !== "admin" && (
                          <td className="p-2 border-b border-gray-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/editOrder?orderId=${ord._id}`);
                              }}
                              className={
                                "p-2 m-1 px-4 rounded-md text-sm bg-green-500 text-white"
                              }
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowModal(true);
                                setCancelOrderId(ord._id);
                              }}
                              className={
                                "p-2 ml-1 px-4 rounded-md text-sm bg-red-500 text-white"
                              }
                            >
                              Cancel
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
            </tbody>
          </table>

          {/* Custom Context Menu */}
          {contextMenu && (
            <div
              style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                background: "white",
                border: "1px solid gray",
                borderRadius: "8px",
                zIndex: 1000,
                padding: "3px",
              }}
            >
              <ul>
                <li
                  onClick={() =>
                    handleContextMenuAction("view", contextMenu.orderId)
                  }
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  View Order
                </li>
                <li
                  onClick={() =>
                    handleContextMenuAction("edit", contextMenu.orderId)
                  }
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  Edit Order
                </li>
                <li
                  onMouseEnter={() => setShowStatusMenu(true)}
                  onMouseLeave={() => setShowStatusMenu(false)}
                  className="relative cursor-pointer hover:bg-gray-200 p-2"
                >
                  Change Order Status
                  {showStatusMenu && (
                    <ul
                      className="absolute left-full top-0 bg-white border border-gray-300 rounded-md shadow-lg"
                      style={{ zIndex: 1000, padding: "4px" }}
                    >
                      {allStatus
                        .filter(
                          (status) =>
                            status.id !== "all" &&
                            status.id !== order &&
                            status.id !== "cancelled"
                        )
                        .map((status) => (
                          <li
                            key={status.id}
                            onClick={() =>
                              handleStatusChange(status.id, contextMenu.orderId)
                            }
                            className="cursor-pointer hover:bg-gray-200 p-2"
                          >
                            {status.name}
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
                <li
                  onClick={(e) => {
                    setContextMenu(null);
                    e.stopPropagation();
                    setShowModal(true);
                    setCancelOrderId(contextMenu.orderId);
                  }}
                  className="cursor-pointer hover:bg-gray-200 p-2"
                >
                  Cancel Order
                </li>
              </ul>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to cancel this order?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModal(false)} // Close modal
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
                  >
                    No
                  </button>
                  <button
                    onClick={() => handleCancelOrder(cancelOrderId)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
