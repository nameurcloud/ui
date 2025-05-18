import { useEffect, useState } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { Gauge } from '@mui/x-charts/Gauge'
import { Box, Card, CardActions, CardContent, Paper, Typography } from '@mui/material'
import { BarChart, LineChart, PieChart } from '@mui/x-charts'
import { getDashboardData, DashData } from '../../hooks/dashboard'

export default function DashboardLayout() {
  useAuthGuard()

  const [dash, setDash] = useState<DashData>()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getDashboardData()
        setDash(result)
      } catch (err) {
        console.error('Failed to fetch Dashboard Data:', err)
      }
    }
    fetchDashboardData()
  }, [])

  useEffect(() => {
    document.title = 'Dashboard'
  }, [])

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
      }}
    >
      {/* Small tiles */}
      {[
        'Total Number of Names',
        'Mode Wise',
        "CSP's on-borad",
        'Configured Region',
        'Configured Resource',
      ].map((title, i) => (
        <Paper
          key={title}
          elevation={4}
          sx={{
            width: {
              xs: '100%', // full width on mobile
              sm: 'calc(50% - 8px)', // tighter gap for two columns
              md: i === 4 ? 400 : 200, // reduced width on large screens
            },
            height: 200, // reduced height
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <CardContent sx={{ width: '100%', textAlign: 'center' }}>
              {i === 0 && (
                <Gauge value={dash?.generatedNameCount ?? 0} sx={{ maxWidth: 250, mx: 'auto' }} />
              )}
              {i === 1 && (
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: dash?.modeCount.UI ?? 0, label: 'UI' },
                        { id: 1, value: dash?.modeCount.API ?? 0, label: 'API' },
                      ],
                      innerRadius: 60,
                    },
                  ]}
                  width={200}
                  height={200}
                />
              )}
              {i === 2 && (
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontWeight: 'bold', textAlign: 'center', my: 4 }}
                >
                  {dash?.cspCount}
                </Typography>
              )}
              {i === 3 && 'Hello'}
              {i === 4 && (
                <BarChart
                  dataset={dash?.cspResRegCount ?? []}
                  width={350}
                  height={120}
                  xAxis={[{ dataKey: 'csp', scaleType: 'band' }]} // x-axis uses CSP names
                  series={[
                    { dataKey: 'region', label: 'Regions', color: '#42a5f5' },
                    { dataKey: 'resource', label: 'Resources', color: '#66bb6a' },
                  ]}
                  margin={{ top: 1, bottom: 1, left: 1, right: 1 }}
                />
              )}
            </CardContent>
          </Card>
          <CardActions sx={{ justifyContent: 'center', padding: 1 }}>
            <Typography variant="subtitle1">{title}</Typography>
          </CardActions>
        </Paper>
      ))}
    </Box>
  )
}
