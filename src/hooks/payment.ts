// src/services/payment.ts
export const openRazorpay = async ({
  amount,
  email,
  name,
}: {
  amount: number // INR in rupees
  email: string
  name: string
}) => {
  const res = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100 }), // Razorpay expects paise
  })
  const data = await res.json()

  const options = {
    key: 'RAZORPAY_KEY_ID', // replace with your real Razorpay Key ID
    amount: data.amount,
    currency: 'INR',
    name: 'Your Company Name',
    description: 'Payment for Subscription',
    image: '/logo.png',
    order_id: data.id,
    handler: function (response: any) {
      alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`)
    },
    prefill: {
      name,
      email,
    },
    theme: {
      color: '#1976d2',
    },
  }

  const rzp = new (window as any).Razorpay(options)
  rzp.open()
}
