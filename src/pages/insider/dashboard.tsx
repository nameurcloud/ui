import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, validateSession } from "../../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = (getToken()).token;
      if (!token) {
        navigate("/login");
        setError("Session expired or unauthorized");
        return;
      }else{
        setUser((getToken()).email)
      }

 
    };

    checkSession();
  }, []);

  if (error) return <p>{error}</p>;
 

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome back! {user}</p>
    </div>
  );
};

export default Dashboard;
