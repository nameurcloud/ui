import { useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function Faq() {
  useAuthGuard(); 

useEffect(() => {
    document.title = "FaQ";
  }, []);
  return (
    <div style={{ padding: 20 }}>
      <h1>FAQ</h1>
      <p>Welcome back! </p>
    </div>
  );
}
