import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../services/authService";

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
      localStorage.setItem("logoutmsg","Not Logged In");
      navigate("/logout");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log("User ID from token:", decoded.sub);
      console.log("Exp from token:", decoded.exp*1000);
      console.log("Time now : ", Date.now())
      if (decoded.exp * 1000 < Date.now()) {
        
        localStorage.setItem("logoutmsg","Session Expired");
        navigate("/logout");
        logoutUser()
      }
    } catch (err) {
      
      localStorage.setItem("logoutmsg","Unable to verify authention, Please login.");
      navigate("/logout");
      logoutUser()
      
      
    }
  }, [location.pathname]);
};
