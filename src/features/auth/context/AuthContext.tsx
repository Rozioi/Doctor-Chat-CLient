import {
  useState,
  type ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { useAuthReq } from "../../../hooks/useAuthReq";
import type { User } from "../../../api/types";
import { authContext } from "./authContextInstance";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login } = useAuthReq();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedIsLogin = localStorage.getItem("isLogin");
        const savedPhoneNumber = localStorage.getItem("phoneNumber");
        const savedTelegramData = localStorage.getItem("telegramData");

        // 1. Immediately set user from cache if available
        if (savedIsLogin === "true" && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setIsLogin(true);
            // We can stop loading here to show UI immediately
            setIsLoading(false);
          } catch (e) {
            console.error("Error parsing saved user", e);
          }
        }

        // 2. Perform background verification/update if needed
        if (savedPhoneNumber && savedTelegramData && window.Telegram?.WebApp) {
          const currentTelegramUser = window.Telegram.WebApp.initDataUnsafe.user;
          const savedTelegramUser = JSON.parse(savedTelegramData);

          if (currentTelegramUser?.id && currentTelegramUser.id === savedTelegramUser?.id) {
            // We directly use login because even if user is not found, login handles it.
            // No need to call getUserByTelegramId separately if we are going to call login anyway.
            const response = await login(savedPhoneNumber);

            if (response.success && response.data) {
              const userData = response.data;
              setUser(userData);
              setIsLogin(true);
              localStorage.setItem("user", JSON.stringify(userData));
              localStorage.setItem("isLogin", "true");
            } else {
              // Only logout if verification fails explicitly
              logout();
            }
          }
        }
      } catch (error) {
        console.error("Auto login error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    autoLogin();
  }, [login]);

  const loginFunc = async (phoneNumber: string) => {
    try {
      const response = await login(phoneNumber);

      if (response.success && response.data) {
        const userData = response.data;

        setUser(userData);
        setIsLogin(true);

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("phoneNumber", phoneNumber);

        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
          localStorage.setItem("telegramData", JSON.stringify(telegramUser));
        }

        return { success: true, user: userData };
      } else {
        return { success: false, error: response.error || "Ошибка входа" };
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : axios.isAxiosError(err)
            ? err.response?.data?.error || "Ошибка сервера"
            : "Ошибка сервера";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      // await axios.post("/api/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsLogin(false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("telegramData");
    }
  };

  return (
    <authContext.Provider
      value={{ user, isLogin, loginFunc, logout, isLoading }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
