import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import api from "../api/config.js";
import { toast } from "sonner";
import Loading from "../components/Loading.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const EmailVerification = () => {
  const { updateUserInfo, authState } = useAuth();
  const { userInfo, token } = authState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [code, setCode] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (userInfo.isEmailVerified) {
      navigate("/userVerification");
    } else {
      const sendCode = async () => {
        const response = await api.post(
          "/mail/sendCode",
          {},
          { headers: { token } }
        );
        console.log(response);
      };
      if (!hasFetched.current) {
        sendCode();
        hasFetched.current = true;
      }
      // sendCode();
    }
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  const handleResendCode = async () => {
    if (canResend) {
      try {
        setLoading(true);

        const response = await api.post(
          "/mail/sendCode",
          {},
          { headers: { token } }
        );
        console.log("Resending code...");

        if (response.data.success) {
          setResendCountdown(10);
          setCanResend(false);
        }
      } catch (error) {
        console.error("Failed to resend code:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await api.post(
      "/mail/verifyCode",
      { code },
      { headers: { token }, withCredentials: true }
    );
    console.log(response);
    setLoading(false);
    if (response.data.success) {
      await updateUserInfo(response.data.data);
      toast.success(response.data.message, {
        duration: 1000,
        onAutoClose: () => navigate("/userVerification"),
      });
    } else {
      toast.error(response.data.message, {
        duration: 2000,
      });
    }
  };

  return (
    <div className="p-4 sm:ml-64 mt-10">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        {loading && <Loading />}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <EnvelopeIcon className="h-6 w-6 text-blue-500 mr-2" />
          Email Verification
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Verification code has been sent to your email address. Please enter
          the code below.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Enter Verification Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              placeholder="XXXXXX"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">Didn't receive code? </span>
          <button
            onClick={handleResendCode}
            disabled={!canResend || loading}
            className={`${
              canResend && !loading
                ? "text-blue-500 hover:underline cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            } text-sm font-medium focus:outline-none`}
          >
            {canResend ? "Re-send Code" : `Re-send in ${resendCountdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
