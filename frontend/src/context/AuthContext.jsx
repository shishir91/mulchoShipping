import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userInfo: null,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Function to get and decrypt userInfo from cookies
  const loadAuthData = async () => {
    const encryptedData = Cookies.get("userInfo");
    let userInfo = null;

    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedData,
          import.meta.env.VITE_CLIENT_SECRET_KEY
        );
        userInfo = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error("Failed to decrypt userInfo:", error);
      }
    }

    setAuthState({
      userInfo,
      token: Cookies.get("token") || null,
    });

    setIsLoading(false); // Mark loading as complete
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  // Function to update auth state (for login/logout)
  const updateAuth = async (userInfo, token) => {
    setAuthState({ userInfo, token });
    if (userInfo && token) {
      const encryptedUserInfo = CryptoJS.AES.encrypt(
        JSON.stringify(userInfo),
        import.meta.env.VITE_CLIENT_SECRET_KEY
      ).toString();
      Cookies.set("userInfo", encryptedUserInfo, {
        expires: 3650,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("token", token, {
        expires: 3650,
        secure: true,
        sameSite: "Strict",
      });
    } else {
      Cookies.remove("userInfo");
      Cookies.remove("token");
    }
  };

  return (
    <AuthContext.Provider value={{ authState, updateAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
