const API_URL = import.meta.env.VITE_API_URL

export const getPlan = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/plan`, {
      method: 'GET',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch plan, status: ' + response.status)
    }

    const data = await response.json()
    return data.userPlan.plan
  } catch (error: any) {
    console.error('Error fetching plan:', error)
    throw new Error('Error fetching plan: ' + (error.message || error))
  }
}
