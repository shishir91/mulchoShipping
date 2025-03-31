import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";

const Alerter = ({ userStatus, userVerified }) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (userStatus === "blocked") {
      setMessage(
        "Your account is currently blocked. You can mail mulcho456@gmail.com to request to unblock your account."
      );
    } else if (userStatus === "underReview") {
      setMessage(
        "Your account is currently under review. It may take 24 hours to verify your account. You will be notify through email once you are verified."
      );
    } else if (!userVerified) {
      setMessage(
        "Your account is not verified yet. Please proceed to Verify Your Account and kindly fill the form."
      );
    }
  }, [userStatus]);
  return (
    <div>
      <Alert severity="info" color="warning">
        {message}
      </Alert>
    </div>
  );
};

export default Alerter;
