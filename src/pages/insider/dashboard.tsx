import { useEffect } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { Gauge } from '@mui/x-charts/Gauge'
import { Box, Card, CardActions, CardContent, Paper } from '@mui/material'
import { PieChart } from '@mui/x-charts'

export default function DashboardLayout() {
  useAuthGuard() // Redirects if not authenticated
  useEffect(() => {
    document.title = 'Dashboard'
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 150,
            height: 128,
          },
        }}
      >
         <Paper elevation={24}>
          <Card>
            <CardContent>
              <Gauge value={50} />
            </CardContent>
          </Card>
          <CardActions>Names Generated</CardActions>
        </Paper>

         <Paper elevation={24}>
          <Card>
            <CardContent>
               <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={200}
      height={200}
    />
            </CardContent>
          </Card>
          <CardActions>Names Generated</CardActions>
        </Paper>

         <Paper elevation={24}>
          <Card>
            <CardContent>
              <Gauge value={50} />
            </CardContent>
          </Card>
          <CardActions>Names Generated</CardActions>
        </Paper>

         <Paper elevation={24}>
          <Card>
            <CardContent>
              <Gauge value={50} />
            </CardContent>
          </Card>
          <CardActions>Names Generated</CardActions>
        </Paper>

        <Paper elevation={24}>
          <Card>
            <CardContent>
              <Gauge value={50} />
            </CardContent>
          </Card>
          <CardActions>Names Generated</CardActions>
        </Paper>
      </Box>
    </div>
  )
}
