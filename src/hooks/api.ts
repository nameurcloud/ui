const API_URL = import.meta.env.VITE_API_URL

export interface apiKey {
  id: String
  partialKey: string
  key: string
  email: string
  expiry: Date | null
  permissions: string[]
}


export const GenApiKey = async (
  email: string,
  expiry: Date,
  permissions: string[]
): Promise<string> => {
  const res = await fetch(`${API_URL}/genapkey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      expiry: expiry.toISOString(), // ✅ convert Date to string
      permissions,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to generate API key: ${res.status} - ${errorText}`);
  }

  const data = await res.json();

  return data.apiKey; // ✅ return the actual string
};


export const setApiKey = async (key: apiKey) => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/apkey`, {
      method: 'POST',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(key),
    })

    if (!response.ok) {
      throw new Error('Failed to create Api key : ' + response.status)
    }

    const data = await response.json()
    return data.status
  } catch (error: any) {
    console.error('Error creating api key:', error)
    throw new Error('Error creating api key : ' + (error.message || error))
  }
}

export const getApiKeys = async (): Promise<apiKey[]> => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/apkey`, {
      method: 'GET',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch API keys: ' + response.status)
    }

    const data = await response.json()
    // Assuming your backend returns an array of apiKey objects
    return data.keys as apiKey[]
  } catch (error: any) {
    console.error('Error fetching API keys:', error)
    throw new Error('Error fetching API keys: ' + (error.message || error))
  }
}

export const deleteApiKeyByPartialKeyAndEmail = async (
  partialKey: string,
  email: string
): Promise<string> => {
  const token = localStorage.getItem('token')

  // encodeURIComponent to safely encode query params
  const url = `${API_URL}/apkey?partial_key=${encodeURIComponent(partialKey)}&email=${encodeURIComponent(email)}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-App-Auth': token || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete API key: ' + response.status)
    }

    const data = await response.json()
    return data.status
  } catch (error: any) {
    console.error('Error deleting API key:', error)
    throw new Error('Error deleting API key: ' + (error.message || error))
  }
}
