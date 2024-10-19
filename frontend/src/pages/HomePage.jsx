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

  return <div>HomePage</div>;
};

export default HomePage;
