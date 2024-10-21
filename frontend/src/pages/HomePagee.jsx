import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");
    if (userInfo && token) {
      return navigate("/dashboard");
    }
  }, []);

  return <div className="mt-20 text-lg font-bold ">HomePage is currently under development. You can Login / Register and view other features</div>;
};

export default HomePage;
