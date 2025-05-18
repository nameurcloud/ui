import { useEffect } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'

export default function Recom() {
  useAuthGuard()

  useEffect(() => {
    document.title = 'Recommendations'
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Recommendation</h1>
      <p>Welcome back! </p>
    </div>
  )
}
