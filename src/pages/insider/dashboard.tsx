import { useEffect, useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { getUserProfile } from "../../hooks/user";

export default function DashboardLayout() {
  useAuthGuard(); // Redirects if not authenticated

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile(); // calls /profile
        setUserProfile(profile.result);
      } catch (err: any) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Welcome, {JSON.stringify(userProfile)}!</p>
    </div>
  );
}
