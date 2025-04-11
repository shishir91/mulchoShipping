import React, { useEffect } from "react";
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
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { authState, updateAuth, isLoading } = useAuth();
  useEffect(() => {
    const handleStorageChange = async () => {
      const encryptedData = Cookies.get("userInfo");
      if (!encryptedData) return;

      const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        import.meta.env.VITE_CLIENT_SECRET_KEY
      );
      const userInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const token = Cookies.get("token");

      // 🔥 Prevent infinite loop: only update if changed
      if (
        JSON.stringify(authState.userInfo) !== JSON.stringify(userInfo) ||
        authState.token !== token
      ) {
        await updateAuth(userInfo, token);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [authState]); // Depend on authState to check changes

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      // Render a loading state while loading auth data
      return <div>Loading...</div>;
    }

    if (!authState.userInfo || !authState.token) {
      console.log(authState);
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Public route (redirect if logged in)
  const PublicRoute = ({ children }) => {
    if (authState.userInfo && authState.token) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };
  return (
    <Router>
      {/* <Loading/> */}
      <Navbar />
      <Toaster richColors expand={false} position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

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
