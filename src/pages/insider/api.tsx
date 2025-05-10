import { useAuthGuard } from "../../hooks/useAuthGuard"
import { useEffect, useState } from "react"
import { getPlan } from "../../hooks/plan"
import { Box, Typography, Paper, CircularProgress, useTheme } from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"

export default function Api() {
  useAuthGuard()
  useEffect(() => {
      document.title = "API";
    }, []);
  const theme = useTheme()

  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const result = await getPlan()
        setPlan(result)
      } catch (err) {
        console.error("Failed to fetch plan:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [])

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  const isLimitedPlan = plan === "Essentials" || plan === "Premium"

  if (isLimitedPlan) {
    return (
        <Box
  sx={{
    p: 4,
    height: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }}
>
  <Paper
    elevation={3}
    sx={{
      p: 4,
      maxWidth: 400,
      textAlign: 'center',
      backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#fafafa',
      borderRadius: 3,
    }}
  >
    <LockIcon
      sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }}
    />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Plan Name: <strong>{plan}</strong>
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Your current plan does not support this feature.
      <br />
      Upgrade to a premium plan to unlock full configuration access.
    </Typography>
  </Paper>
</Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        API
      </Typography>
      <Typography variant="body1">Welcome back!</Typography>
    </Box>
  )
}
