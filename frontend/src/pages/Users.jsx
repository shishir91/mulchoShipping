import React, { useEffect, useState } from "react";
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import api from "../api/config.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userStatus = queryParams.get("users");

  const { authState } = useAuth();
  const { userInfo: user, token } = authState;

  let filteredUsers;

  useEffect(() => {
    if (user.role != "admin") {
      navigate("/dashboard");
    }
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/admin/users", { headers: { token } });
        console.log(response);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (userStatus) {
    switch (userStatus) {
      case "verified":
        filteredUsers = users.filter((users) => users.isUserVerified === true);
        break;
      case "underReview":
        filteredUsers = users.filter((users) => users.status === userStatus);
        break;
      case "notVerified":
        filteredUsers = users.filter(
          (users) => users.isUserVerified === false && users.status === "active"
        );
        break;
      case "blocked":
        filteredUsers = users.filter((users) => users.status === userStatus);
        break;

      default:
        break;
    }
    console.log(filteredUsers);
  }

  return (
    <div className="p-4 sm:ml-64 mt-4">
      {isLoading && <Loading />}
      <h2 className="text-2xl font-semibold mb-4">Users List</h2>
      {/* Status Tabs */}
      <div className="flex flex-wrap md:flex-nowrap space-x-2 mb-4 overflow-x-auto scrollbar-hide">
        {[
          { name: "All USERS", id: "all" },
          { name: "VERIFIED", id: "verified" },
          { name: "UNDER REVIEW", id: "underReview" },
          { name: "NOT-VERIFIED", id: "notVerified" },
          { name: "BLOCKED", id: "blocked" },
        ].map((status, index) => (
          <button
            onClick={() => navigate(`/users?users=${status.id}`)}
            key={index}
            className={`p-2 px-4 mb-2 cursor-pointer rounded-md text-sm whitespace-nowrap ${
              userStatus
                ? status.id == userStatus
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
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <ul>
          {!userStatus || userStatus == "all"
            ? users.map((user) => (
                <li
                  onClick={() => navigate(`/userDetail?user=${user._id}`)}
                  key={user._id}
                  className="cursor-pointer flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                </li>
              ))
            : filteredUsers.map((user) => (
                <li
                  onClick={() => navigate(`/userDetail?user=${user._id}`)}
                  key={user._id}
                  className="cursor-pointer flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center">
                    <UserIcon className="h-6 w-6 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
