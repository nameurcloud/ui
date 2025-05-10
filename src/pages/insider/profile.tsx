import { useEffect, useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { getUserProfile } from "../../hooks/user";
import { useTheme } from "@mui/material/styles";
import { Box, Skeleton } from "@mui/material";

export default function Profile() {
  useAuthGuard(); // Redirects if not authenticated
  useEffect(() => {
      document.title = "Profile";
    }, []);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;
  if (error) return <p style={{ padding: 16, color: "red" }}>{error}</p>;
  if (!userProfile) return <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="rectangular" height={60} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" height={150} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" height={100} sx={{ my: 1 }} />
    </Box>
;

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#fff",
    color: isDark ? "#f5f5f5" : "#222",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: isDark
      ? "0 2px 8px rgba(255, 255, 255, 0.05)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${isDark ? "#333" : "#ddd"}`,
  };

const photoStyle: React.CSSProperties = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover",
  marginBottom: "12px",
  border: `2px solid ${theme.palette.primary.main}`,
};


  const layoutStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const leftStyle: React.CSSProperties = {
    ...cardStyle,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    flex: 2,
  };

  const rightStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
  };

  // Responsive: row on large screens
const responsiveLayout: React.CSSProperties =
  typeof window !== "undefined" && window.innerWidth >= 768
    ? { ...layoutStyle, flexDirection: "row" as React.CSSProperties["flexDirection"] }
    : layoutStyle;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>My Account</h1>
      <div style={responsiveLayout}>
        {/* Left Box */}
        <div style={leftStyle}>
          <img
            src={userProfile.photoUrl || "/images/5.png"}
            alt="Profile"
            style={photoStyle}
          />
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {userProfile.fname} {userProfile.lname}
          </div>
          <div style={{ fontSize: 14, color: isDark ? "#aaa" : "#777", marginTop: 6 }}>
            DOB: {userProfile.dob}
          </div>
        </div>

        {/* Right Boxes */}
        
        <div style={rightStyle}>
          <div style={{...cardStyle}}>
        <div><strong>Organization:</strong> {userProfile.org} </div>
        </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Contact Info
            </div>
            <div><strong>Email:</strong> {userProfile.email}</div>
            <div><strong>Phone:</strong> {userProfile.mobile}</div>
          </div>
          <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Plan
            </div>
            <div><strong>Name:</strong> {userProfile.plan} </div>
            <div><strong>Expiry:</strong> Not Applicable </div>
            <div><strong>Payment:</strong> Not Applicable </div>
          </div>
         
        
    
        </div>
        
      </div>

      
     


    </div>
  );
}
