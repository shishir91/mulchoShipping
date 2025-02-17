import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Order from "./pages/Order";
import Sidebar from "./components/Sidebar";
import AddOrder from "./pages/AddOrder";
import EmailVerification from "./pages/EmailVerification";
import UserVerification from "./pages/UserVerification";
import Loading from "./components/Loading";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import OrderDetail from "./pages/OrderDetail";
import EditOrder from "./pages/EditOrder";
import MyIncome from "./pages/MyIncome";
import Payment from "./pages/Payment";
import PaymentDetail from "./pages/PaymentDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import MyProducts from "./pages/MyProducts";

// A Protected Route component
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  // If no user info or token, redirect to login
  if (!userInfo || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      {/* <Loading/> */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <MyIncome />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addProduct"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <AddProduct />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Products />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myProducts"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <MyProducts />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/productDetail"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <ProductDetail />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editProduct"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <EditProduct />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Payment />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymentDetail"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <PaymentDetail />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Order />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orderDetail"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <OrderDetail />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addOrder"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <AddOrder />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/editOrder"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <EditOrder />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/emailVerification"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <EmailVerification />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userVerification"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <UserVerification />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <Users />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userDetail"
          element={
            <ProtectedRoute>
              <>
                <Sidebar />
                <UserDetail />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
