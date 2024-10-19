import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingBagIcon,
  ReceiptRefundIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import api from "../api/config.js";

const Dashboard = () => {
  const hasFetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [userOrders, setUserOrders] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const userls = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  let cancelledCount = 0;
  let returnedCount = 0;
  let deliveredCount = 0;

  const fetchUserData = async () => {
    const response = await api.get("/user", { headers: { token } });
    if (response.data.success) {
      setUser(response.data.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data.data));
      const response1 = await api.get("/admin/users", { headers: { token } });
      if (response1.data.success) {
        setTotalUsers(response1.data.users.length);
      }
    }
  };
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
      fetchUserData();
      if (userls.role == "admin") {
        fetchAllOrders();
        hasFetched.current = true;
      } else {
        fetchUserOrders();
        hasFetched.current = true;
      }
    }
  }, []);

  const countByStatus = (orders, status) => {
    return orders.filter((order) => order.status === status).length;
  };

  cancelledCount = countByStatus(userOrders, "cancelled");
  returnedCount = countByStatus(userOrders, "returned");
  deliveredCount = countByStatus(userOrders, "delivered");

  const stats = [
    {
      id: 1,
      title: "Total Delivered Orders",
      value: deliveredCount,
      icon: <ShoppingBagIcon className="h-6 w-6 text-green-500" />,
    },
    {
      id: 2,
      title: "Returned Orders",
      value: returnedCount,
      icon: <ReceiptRefundIcon className="h-6 w-6 text-orange-500" />,
    },
    {
      id: 3,
      title: "Cancelled Orders",
      value: cancelledCount,
      icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
    },
    {
      id: 4,
      title: "All Orders",
      value: userOrders.length,
      icon: <ArchiveBoxIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      id: 6,
      title: "Total Sales",
      value: `Rs. ${user.receivedPayment}`,
      icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      id: 8,
      title: "Life Time Earning",
      value: `Rs. ${user.lifetimeIncome}`,
      icon: <CreditCardIcon className="h-6 w-6 text-green-500" />,
    },
  ];
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center p-4 bg-white shadow rounded-lg"
            >
              <div className="flex-shrink-0">{stat.icon}</div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">
                  {stat.title}
                </h4>
                <p className="text-xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
          {user.role === "admin" && (
            <div className="flex items-center p-4 bg-white shadow rounded-lg">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500">Users</h4>
                <p className="text-xl font-semibold text-gray-900">
                  {totalUsers}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
