import { useEffect, useState } from 'react'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import { getToken } from '../../hooks/useAuthGuard'

export default function Profile() {
  const profile = useAuthGuard()

  const [user, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const emailid = getToken()
    setEmail(emailid?.email ?? null)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Profile</h1>
      <p>Welcome back! {user}</p>
      <p>{JSON.stringify(profile)}</p>
    </div>
  )
}
