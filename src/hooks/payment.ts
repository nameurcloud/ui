const API_URL = import.meta.env.VITE_API_URL
const RZORPAY_KEY_ID = import.meta.env.VITE_API_RAZORPAY_KEY_ID

export const openRazorpay = async ({
  amount,
  email,
  name,
  contact
}: {
  amount: number
  email: string
  name: string
  contact: string
}) => {
  const token = localStorage.getItem('token')
  console.log(amount * 100)
  const res = await fetch(`${API_URL}/create-razorpay-order`, {
    method: 'POST',
    headers: {
      'X-App-Auth': token || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amount * 100 }),
  })

  const data = await res.json()

  const options = {
    key: RZORPAY_KEY_ID,
    amount: data.amount,
    currency: 'INR',
    name: 'Name My Cloud',
    description: 'Payment for NMC Subscription',
    image: '/images/logo.png',
    order_id: data.id,
    handler: async function (response: any) {
      try {
        await fetch(`${API_URL}/verify-razorpay-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Auth': token || '',
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

      return {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
      } catch (err) {
        console.error('Verification error:', err)
        alert('Error verifying payment.')
      }
    },
    prefill: {
      name,
      email,
      contact
    },
    theme: {
      color: '#1976d2',
    },
  }

  const rzp = new (window as any).Razorpay(options)
  rzp.open()
}
