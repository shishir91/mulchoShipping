import React, { useEffect, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../components/Loading.jsx";
import api from "../api/config.js";
import { useAuth } from "../context/AuthContext.jsx";

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("user");

  const { authState } = useAuth();
  const { userInfo, token } = authState;
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      const response = await api.get(`/admin/user/${userId}`, {
        headers: { token },
      });
      setIsLoading(false);
      if (response.data.success) {
        setUser(response.data.user);
      }
    }
    fetchUser();
  }, [userId]);

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  const handleSubmit = async (userStatus, reason) => {
    try {
      setIsLoading(true);
      const response = await api.put(
        `/admin/userStatus/${user._id}?userStatus=${userStatus}`,
        { reason },
        {
          headers: { token },
        }
      );
      setIsLoading(false);
      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          status: "active",
          isUserVerified: true,
        }));
        toast.success(response.data.message);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
      <ToastContainer />
      {isLoading && <Loading />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UserIcon className="h-12 w-12 text-blue-500 mr-4" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
              {user.email}
            </p>
          </div>
        </div>

        {user.status === "underReview" && (
          <div>
            <button
              onClick={() => handleSubmit("verify")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold mx-4 py-2 px-4 rounded-lg shadow"
            >
              Verify User
            </button>
            <button
              onClick={() => {
                setShowModal(true), setStatus("unVerify");
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold mx-4 py-2 px-4 rounded-lg shadow"
            >
              Unverify User
            </button>
          </div>
        )}
        {user.status === "blocked" ? (
          <button
            onClick={() => handleSubmit("unBlock")}
            className="bg-red-700 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            Unblock User
          </button>
        ) : (
          <button
            onClick={() => {
              setShowModal(true), setStatus("block");
            }}
            className="bg-red-700 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            Block User
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto shadow-lg">
            {status === "unVerify" ? (
              <h2 className="text-xl font-semibold mb-4">Unverify User</h2>
            ) : (
              <h2 className="text-xl font-semibold mb-4">Block User</h2>
            )}
            <p className="text-gray-600 mb-2">Please provide a reason :</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)} // Close modal
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              {status === "unVerify" ? (
                <button
                  onClick={() => handleSubmit("unVerify", reason)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Confirm Unverify
                </button>
              ) : (
                <button
                  onClick={() => handleSubmit("block", reason)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Confirm Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Phone:</p>
          <p className="text-gray-500">{user.phone}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Date of Birth:</p>
          <p className="text-gray-500">
            {new Date(user.dob).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Gender:</p>
          <p className="text-gray-500">{user.gender}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Role:</p>
          <p className="text-gray-500">{user.role}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Status:</p>
          <p className="text-gray-500 capitalize">{user.status}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Pending Payment:</p>
          <p className="text-gray-500">${user.pendingPayment}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Received Payment:</p>
          <p className="text-gray-500">${user.receivedPayment}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Lifetime Income:</p>
          <p className="text-gray-500">${user.lifetimeIncome}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Email Verified:</p>
          <p className="text-gray-500 flex items-center">
            {user.isEmailVerified ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            )}
            {user.isEmailVerified ? "Yes" : "No"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">User Verified:</p>
          <p className="text-gray-500 flex items-center">
            {user.isUserVerified ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            )}
            {user.isUserVerified ? "Yes" : "No"}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow col-span-1 sm:col-span-2">
          <p className="font-semibold text-gray-700">Facebook:</p>
          <a
            href={user.fb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {user.fb}
          </a>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <p className="font-semibold text-gray-700">Referred By:</p>
          <p className="text-gray-500">{user.referedby}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow col-span-1 sm:col-span-2">
          <p className="font-semibold text-gray-700">Payment QR:</p>
          <img
            src={user.payment}
            alt="Payment QR"
            className="rounded-lg mt-2 max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
