import { useEffect, useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { getToken } from "../../services/authService";

export default function Api() {
  useAuthGuard(); 

  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const { email } = getToken();
    setUser(email);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>API</h1>
      <p>Welcome back! {user}</p>
    </div>
  );
}
