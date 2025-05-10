import { useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function DashboardLayout() {
  useAuthGuard(); // Redirects if not authenticated
 useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
    </div>
  );
}
