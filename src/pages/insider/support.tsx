import { useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function Support() {
  useAuthGuard(); 

  useEffect(() => {
    document.title = "Support";
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Support</h1>
      <p>Welcome back! </p>
    </div>
  );
}
