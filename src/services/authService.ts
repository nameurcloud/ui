const API_URL = import.meta.env.VITE_API_URL
export const registerUser = async (
  email: string,
  password: string,
  fname: string,
  lname: string,
  mobile: string,
  dob: string,
  plan: string
) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fname, lname, mobile, dob, plan }),
  })
  return res
}

export const loginUser = async (email: string, password: string) => {
  const logoutmsg = localStorage.getItem('logoutmsg')
  if (logoutmsg) {
    localStorage.removeItem('logoutmsg')
  }
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  return res
}

export const logoutUser = () => {
  localStorage.removeItem('token')
}

export const navigator = async (path: string, navigate: (to: string) => void) => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/insider/${path}`, {
      method: 'GET',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      localStorage.setItem('logoutmsg', 'Unauthorized Access. Please login.')
      logoutUser()
      navigate('/logout')
      return null
    }

    const data = await response.json()
    return data.profile // ✅ Return user profile
  } catch (error) {
    localStorage.setItem('logoutmsg', 'Error Validating Access. Please login.')
    logoutUser()
    navigate('/logout')
    console.error('Error:', error)
    return null
  }
}
