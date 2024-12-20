import React from "react";
import {
  ChartPieIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-15 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900 ">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <ChartPieIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <ShoppingBagIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="ms-3">Products</span>
              </a>
            </li>

            <li>
              <a
                href="/orders"
                className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <ArchiveBoxIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Orders</span>
              </a>
            </li>

            <li>
              {user.role === "admin" ? (
                <a
                  href="/payment"
                  className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                >
                  <CurrencyDollarIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Payment</span>
                </a>
              ) : (
                <a
                  href="/income"
                  className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                >
                  <CurrencyDollarIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    My Income
                  </span>
                </a>
              )}
            </li>

            {user.role == "admin" && (
              <li>
                <a
                  href="/users"
                  className="flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group"
                >
                  <UserGroupIcon className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
