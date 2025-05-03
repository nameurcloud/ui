import { Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Logout: React.FC = () => {
  const [logoutmsg, setLogoutmsg] = useState<string | null>('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)

  useEffect(() => {
    const msg = localStorage.getItem('logoutmsg')
    setLogoutmsg(msg)

    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoggedIn(false)
    }
  }, [])

  useEffect(() => {
    if (logoutmsg) {
      const timeout = setTimeout(() => {
        localStorage.removeItem('logoutmsg')
      }, 0)
      return () => clearTimeout(timeout)
    }
  }, [logoutmsg])

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <img
        src="/images/lo.svg"
        alt="Robot logged out"
        style={{ maxWidth: '300px', marginBottom: '1.5rem' }}
      />

      <Typography variant="body1" gutterBottom>
        {isLoggedIn ? `Logout reason: ${logoutmsg}` : 'You need to login back.'}
      </Typography>

      <Typography variant="body2">
        <Button component={RouterLink} to="/Login" variant="contained">
          Login
        </Button>
      </Typography>
    </div>
  )
}

export default Logout
