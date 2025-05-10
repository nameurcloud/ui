import { useEffect } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function Names() {
  useAuthGuard(); 
   useEffect(() => {
    document.title = "Names";
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Names</h1>
      <p>Welcome back! </p>
    </div>
  );
}
