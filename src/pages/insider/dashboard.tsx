import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, validateSession } from "../../services/authService";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await validateSession("dashboard", token);
        setUser(response.user);
      } catch (err: any) {
        setError("Session expired or unauthorized");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkSession();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.fname} {user.lname} ({user.email})!</p>
    </div>
  );
};

export default Dashboard;
