import { useEffect } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'

// src/pages/PaymentPage.tsx
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { useState } from 'react'
import { loadRazorpayScript } from '../../components/common/loadRazorpay'
import { openRazorpay } from '../../hooks/payment'

export default function Payment() {
  useAuthGuard()

  useEffect(() => {
    document.title = 'Payments'
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('500')

  const handlePay = async () => {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert('Razorpay failed to load. Check your internet connection.')
      return
    }

    await openRazorpay({
      name,
      email,
      amount: parseFloat(amount),
    })
  }

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pay with Razorpay
        </Typography>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Amount (INR)"
          type="number"
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handlePay}
          disabled={!name || !email || !amount}
        >
          Pay Now
        </Button>
      </Paper>
    </Box>
  )
}
