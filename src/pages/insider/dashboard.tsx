import { useEffect } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { Gauge } from '@mui/x-charts/Gauge'
import { Box, Card, CardActions, CardContent, Paper, Typography } from '@mui/material'
import { LineChart, PieChart } from '@mui/x-charts'

export default function DashboardLayout() {
  useAuthGuard()
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
        alignItems: 'flex-start',
      }}
    >
      {/* Small tiles - fixed medium size */}
      {['Names', 'Region Wise', 'Resource Wise'].map((title, i) => (
        <Paper
          key={title}
          elevation={6}
          sx={{
            width: 280,
            height: 260,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <CardContent sx={{ width: '100%', textAlign: 'center' }}>
              {i === 0 && <Gauge value={50} sx={{ maxWidth: 250, mx: 'auto' }} />}
              {i === 1 && (
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: 10, label: 'Region A' },
                        { id: 1, value: 15, label: 'Region B' },
                        { id: 2, value: 20, label: 'Region C' },
                      ],
                    },
                  ]}
                  width={200}
                  height={200}
                />
              )}
              {i === 2 && (
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: 10, label: 'Resource A' },
                        { id: 1, value: 15, label: 'Resource B' },
                        { id: 2, value: 20, label: 'Resource C' },
                      ],
                    },
                  ]}
                  width={200}
                  height={200}
                />
              )}
            </CardContent>
          </Card>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Typography variant="subtitle1">{title}</Typography>
          </CardActions>
        </Paper>
      ))}

      {/* Last LineChart tile - fills remaining width */}
      <Paper
        elevation={6}
        sx={{
          flexGrow: 1,
          minWidth: 300,
          height: 340,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 260,
        }}
      >
        <Card sx={{ flexGrow: 1 }}>
          <CardContent sx={{ height: '100%' }}>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              height={300}
            />
          </CardContent>
        </Card>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Typography variant="subtitle1">User Generated</Typography>
        </CardActions>
      </Paper>
    </Box>
  )
}
