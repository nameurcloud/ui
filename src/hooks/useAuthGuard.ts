import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { logoutUser, navigator } from '../services/authService'

type JwtPayload = {
  sub: string
  exp: number
}

export const useAuthGuard = () => {
  const [profile, setProfile] = useState<any>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        localStorage.setItem('logoutmsg', 'Not Logged In')
        navigate('/logout')
        return
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token)
        if (Number(decoded.exp) * 1000 < Date.now()) {
          localStorage.setItem('logoutmsg', 'Session Expired')
          logoutUser()
          navigate('/logout')
          return
        }
      } catch (err) {
        localStorage.setItem('logoutmsg', 'Unable to verify authentication. Please login.')
        logoutUser()
        navigate('/logout')
        return
      }

      const path = location.pathname
      const fileName = path.substring(path.lastIndexOf('/') + 1)
      const userProfile = await navigator(fileName, navigate) // Fetch profile
      setProfile(userProfile) // Update the profile state
    }

    checkAuth()
  }, [location.pathname, navigate])

  return profile // Return the profile state
}

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return null
  const decoded = jwtDecode<JwtPayload>(token)
  return { email: decoded.sub }
}
