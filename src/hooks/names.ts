const API_URL = import.meta.env.VITE_API_URL

export interface GeneratedName {
  name: string
  datetime: Date
  user: string
  mode: string
  status: string
}

export const setName = async (namepayload: GeneratedName) => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/name`, {
      method: 'POST',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(namepayload),
    })

    if (!response.ok) {
      throw new Error('Failed to generate name, status: ' + response.status)
    }

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error('Error generating name:', error)
    throw new Error('Error generating name: ' + (error.message || error))
  }
}

export const getName = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/name`, {
      method: 'GET',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch generated names, status: ' + response.status)
    }

    const data = await response.json()

    if (!Array.isArray(data.result)) {
      throw new Error('Expected an array of names but received: ' + JSON.stringify(data))
    }

    return data.result
  } catch (error: any) {
    console.error('Error fetching generated names:', error)
    throw new Error('Error generated names: ' + (error.message || error))
  }
}
