import { useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function Payment() {
  useAuthGuard(); 

  useEffect(() => {
      document.title = "Payments";
    }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Payment</h1>
      <p>Welcome back! </p>
    </div>
  );
}
