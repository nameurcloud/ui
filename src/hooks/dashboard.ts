const API_URL = import.meta.env.VITE_API_URL

export interface DashData {
  generatedNameCount: number
  modeCount: {
    UI: number
    API: number
  }
  cspCount: number
  cspResRegCount: {
    csp: string
    region: number
    resource: number
  }[]
}

export const getDashboardData = async (): Promise<DashData> => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get Dashboard Data : ' + response.status)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error fetchng dashboard data:', error)
    throw new Error('Error fetchng dashboard data : ' + (error.message || error))
  }
}
