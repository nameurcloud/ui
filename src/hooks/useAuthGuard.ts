import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logoutUser, navigator } from "../services/authService";


type JwtPayload = {
  sub: string;
  exp: number;
};

export const useAuthGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("logoutmsg", "Not Logged In");
      navigate("/logout");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (Number(decoded.exp) * 1000 < Date.now()) {
        localStorage.setItem("logoutmsg", "Session Expired");
        logoutUser();
        navigate("/logout");
        return;
      }
    } catch (err) {
      localStorage.setItem("logoutmsg", "Unable to verify authentication. Please login.");
      logoutUser();
      navigate("/logout");
      return;
    }
    navigator(navigate); // ✅ pass navigate safely

  }, [location.pathname, navigate]);
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const decoded = jwtDecode<JwtPayload>(token);
  return { uid: decoded.sub };
};
