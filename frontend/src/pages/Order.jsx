import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/config.js";
import Loading from "../components/Loading.jsx";
import Alerter from "../components/Alerter.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Order = () => {
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modelStatus, setModelStatus] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState();
  const [contextMenu, setContextMenu] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false); // to toggle the status dropdown
  const [userOrders, setUserOrders] = useState([]);

  const { updateUserInfo, authState } = useAuth();
  const { userInfo: user, token } = authState;

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/user", { headers: { token } });
        if (response.data.success) {
          await updateUserInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  let filteredOrders;

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const order = queryParams.get("order");

  const allStatus = [
    { name: "All ORDERS", id: "all" },
    { name: "CONFIRMED", id: "confirmed" },
    { name: "IN-PROCESS", id: "inProcess" },
    { name: "DELIVERED", id: "delivered" },
    { name: "RETURNED", id: "returned" },
    { name: "EXCHANGED", id: "exchanged" },
    { name: "CANCELLED", id: "cancelled" },
  ];

  const fetchUserOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/order/getMyOrders", {
        headers: { token },
      });
      if (response.data.success) {
        setUserOrders(response.data.myOrders);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/orders", {
        headers: { token },
      });
      if (response.data.success) {
        console.log(response);

        setUserOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching all orders:", error);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
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
          duration: 1000,
          onAutoClose: () => {
            setShowModal(false);
            // Re-fetch orders after cancellation
            user.role === "admin" ? fetchAllOrders() : fetchUserOrders();
            navigate(`/orders?order=${order}`);
          },
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setIsLoading(false);
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

  const handleStatusChange = async (status, orderId, amount) => {
    setIsLoading(true);
    console.log(`Changing order ${orderId} to status: ${status}`);
    const response = await api.put(
      "/admin/changeOrderStatus",
      { orderId, status, amount },
      { headers: { token } }
    );
    setIsLoading(false);
    if (response.data.success) {
      setShowModal(false);
      toast.success(response.data.message, {
        duration: 1000,
        onAutoClose: () => {
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
      {(user.status === "blocked" ||
        user.status === "underReview" ||
        !user.isUserVerified) && (
        <Alerter userStatus={user.status} userVerified={user.isUserVerified} />
      )}
      <div className="p-6">
        {isLoading && <Loading />}
        {/* Search Section */}
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search by Product Name / Customer Name"
            className="w-full p-2 border border-gray-300 rounded-md w-1/3"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap md:flex-nowrap space-x-2 mb-4 overflow-x-auto scrollbar-hide">
          {allStatus.map((status, index) => (
            <button
              onClick={() => navigate(`/orders?order=${status.id}`)}
              key={index}
              className={`p-2 px-4 mb-2 cursor-pointer rounded-md text-sm whitespace-nowrap ${
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
          {user.role === "user" &&
            user.status === "active" &&
            user.isUserVerified && (
              <button
                onClick={() => navigate("/addOrder")}
                className="px-4 cursor-pointer rounded-md text-sm bg-blue-500 text-white whitespace-nowrap"
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
                          {ord.product.productName}
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
                            {ord.orderFrom.name}
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
                        onContextMenu={(e) => {
                          order !== "cancelled" &&
                            user.role === "admin" &&
                            handleRightClick(e, ord._id);
                        }}
                      >
                        <td className="p-2 border-b border-gray-300">
                          {index + 1}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {new Date(ord.createdAt).toISOString().split("T")[0]}
                        </td>
                        <td className="p-2 border-b border-gray-300">
                          {ord.product.productName}
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
                            {ord.orderFrom.name}
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
                                "p-2 m-1 px-4 cursor-pointer rounded-md text-sm bg-green-500 text-white"
                              }
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowModal(true);
                                setCancelOrderId(ord._id);
                                setModelStatus("canceled");
                              }}
                              className={
                                "p-2 ml-1 px-4 cursor-pointer rounded-md text-sm bg-red-500 text-white"
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
                            onClick={() => {
                              handleStatusChange(
                                status.id,
                                contextMenu.orderId
                              );
                            }}
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
                    setModelStatus("canceled");
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
          {showModal && modelStatus == "canceled" && (
            <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to cancel this order?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModal(false)} // Close modal
                    className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
                  >
                    No
                  </button>
                  <button
                    onClick={() => handleCancelOrder(cancelOrderId)}
                    className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
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
