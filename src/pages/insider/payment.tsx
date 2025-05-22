import { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import { green, red, orange } from '@mui/material/colors'

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { loadRazorpayScript } from '../../hooks/loadRazorpay'
import { openRazorpay } from '../../hooks/payment'
import { getUserProfile } from '../../hooks/user'
import { getPlan } from '../../hooks/plan'
import subscriptionOptions from '../../components/common/subscriptionOptions'
import { margin } from '@mui/system'

export default function Payment() {
  useAuthGuard()

  const theme = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState<any>()
  const [plan, setPlan] = useState<string>()
  const [prevPlan, setPrevPlan] = useState<string>()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [contact, setContact] = useState<any>()
 const [verifyingRows, setVerifyingRows] = useState<Record<string, boolean>>({})

  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  
  useEffect(() => {
    document.title = 'Payments'

    const fetchData = async () => {
      try {
        const profile = await getUserProfile()
        setUserProfile(profile.result)
        setName(profile.result.fname + ' ' + profile.result.lname)
        setEmail(profile.result.email)
        setContact(profile.result.mobile)
        const result = await getPlan()
        setPrevPlan(result)
        const selected = subscriptionOptions.find((p) => p.plan === result)
        if (selected) {
          setAmount(selected.cost)
          setPlan(selected.plan)
        }
       if (profile.result?.payment) {
  const paymentDetails = profile.result.payment || {}
  setPaymentHistory([
    {
      id: (profile.result.paymentID || '').replace('pay_', ''),  // payment ID
      orderId: (profile.result.paymentOrderID || '').replace('order_', ''), // clean order ID
      amount: profile.result.paymentAmount,
      date: new Date(profile.result.paymentDate).toLocaleDateString(),
      status: profile.result.paymentStatus,
      method: paymentDetails.method || 'N/A',
    },
  ])
}

      } catch (err: any) {
        setError('Failed to load profile or plan')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
 

const verifyPayment = async (orderId: string) => {
  // Simulate API call delay
  return new Promise<{ status: string }>((resolve) =>
    setTimeout(() => resolve({ status: 'captured' }), 1500)
  )
}


const handleVerify = async (orderId: string) => {
  setVerifyingRows((prev) => ({ ...prev, [orderId]: true }))
  try {
    const result = await verifyPayment(orderId)
    // Update the paymentHistory for this orderId
    setPaymentHistory((prev) =>
      prev.map((row) =>
        row.order_id === orderId
          ? { ...row, status: result.status }
          : row
      )
    )
  } catch (error) {
    console.error('Verification failed', error)
    alert('Failed to verify payment')
  } finally {
    setVerifyingRows((prev) => ({ ...prev, [orderId]: false }))
  }
}



  const handlePay = async () => {
    setConfirmOpen(false)
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert('Razorpay failed to load. Check your internet connection.')
      return
    }
    await openRazorpay({
      name,
      email,
      amount: parseFloat(amount),
      contact,
    })
  }
  
  const renderStatusWithIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'created':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: orange[700] }}>
          <HourglassEmptyIcon fontSize="small" sx={{ mr: 0.5 }} />
          In Process
        </Box>
      )
    case 'captured':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: green[700] }}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
          Success
        </Box>
      )
    case 'failed':
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: red[700] }}>
          <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
          Payment Failed
        </Box>
      )
    default:
      return status
  }
}

  const handleSelectPlan = (option: any) => {
    setPlan(option.plan)
    setAmount(option.cost)
  }

 
  if (loading) return <p style={{ padding: 16 }}>Loading...</p>
  if (error) return <p style={{ padding: 16, color: 'red' }}>{error}</p>
  if (!userProfile)
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={60} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={150} sx={{ my: 1 }} />
        <Skeleton variant="rectangular" height={100} sx={{ my: 1 }} />
      </Box>
    )

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1, flexWrap: 'wrap' }}>
      {/* Left Column: Plan Selection */}
      
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="subtitle1" gutterBottom align='center'>
          Subscription Plans
        </Typography>
        {subscriptionOptions.map((option) => (
          <Card
            key={option.plan}
            sx={{
              mb: 1,
              maxHeight: 135, 
              border: plan === option.plan ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
              backgroundColor:
                plan === option.plan
                  ? theme.palette.mode === 'dark'
                    ? theme.palette.action.selected
                    : '#e3f2fd'
                  : theme.palette.background.paper,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 4,
              },
            }}
            onClick={() => handleSelectPlan(option)}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: plan === option.plan ? theme.palette.primary.main : 'inherit' }}
              >
                {option.plan}
              </Typography>
              <Typography variant="body2" sx={{ my: 1 }}>
                {option.content}
              </Typography>
              <Typography variant="subtitle1">₹{option.cost}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Right Column: Payment Box */}
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="subtitle1" gutterBottom align="center">
            Selected Plan: {plan}
          </Typography>
        <Paper sx={{ p: 2 }}>
          
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            size='small'
            value={name}
            disabled ={true}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="dense"
            size='small'
            value={email}
            disabled ={true}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Amount (INR)"
            type="number"
            margin="dense"
            size='small'
            value={amount}
            disabled ={true}
            onChange={(e) => setAmount(e.target.value)}
          />
           <TextField
            fullWidth
            label="Contact"
            type="number"
            margin="dense"
            size='small'
            value={contact}
            disabled ={true}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setConfirmOpen(true)}
            disabled={!name || !email || !amount}
          >
            Pay Now
          </Button>
        </Paper>

      

        {/* Payment History Table */}
{/* Recent Payment Details */}
{paymentHistory.length > 0 && (
  
  <Paper sx={{ mt: 2, p: 2 }}>
  <Typography variant="overline" gutterBottom align="center">
    Payment Receipt
  </Typography>
  <Table size="small">
    <TableBody>
      {[
        ['Order ID', paymentHistory[0].orderId],
        ['Payment ID', paymentHistory[0].id],
        ['Method', paymentHistory[0].method],
        ['Amount', `₹${paymentHistory[0].amount / 100}`],
        ['Date', paymentHistory[0].date],
      ].map(([label, value]) => (
        <TableRow key={label} sx={{ height: 30 }}>
          <TableCell sx={{ py: 0.1 }}>
            <Typography variant="overline">{label}</Typography>
          </TableCell>
          <TableCell sx={{ py: 0.1 }}>{value}</TableCell>
        </TableRow>
      ))}
      <TableRow sx={{ height: 30 }}>
        <TableCell sx={{ py: 0.1 }}>
          <Typography variant="overline">Status</Typography>
        </TableCell>
        <TableCell sx={{ py: 0.1 }}>
          {renderStatusWithIcon(paymentHistory[0].status)}
          {paymentHistory[0].status.toLowerCase() === 'created' && (
            <Button
              size="small"
              sx={{ ml: 2 }}
              onClick={() => handleVerify(paymentHistory[0].orderId)}
              disabled={verifyingRows[paymentHistory[0].orderId]}
            >
              {verifyingRows[paymentHistory[0].orderId] ? 'Verifying...' : 'Verify'}
            </Button>
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</Paper>


)}



      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            You are about to pay <strong>₹{amount}</strong> for the <strong>{plan}</strong> plan.
          </Typography>
          {prevPlan && prevPlan !== plan && (
            <Typography color="warning.main">
              You previously selected the <strong>{prevPlan}</strong> plan during registration. You are now
              switching to <strong>{plan}</strong>. Do you want to proceed?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handlePay} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
