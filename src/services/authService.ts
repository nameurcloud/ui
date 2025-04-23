const API_URL = import.meta.env.VITE_API_URL;

export async function getIdToken(targetAudience: string): Promise<string> {
  const res = await fetch(
    `https://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=${targetAudience}`,
    {
      headers: {
        "Metadata-Flavor": "Google",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to get ID token: ${res.statusText}`);
  }

  return res.text();
}

export const registerUser = async (email: string, password: string,fname: string,lname:string,mobile:string,dob:string) => {
  const token = await getIdToken(API_URL);
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password,fname,lname,mobile,dob })
  });
  return res;
};

export const loginUser = async (email: string, password: string) => {
  const token = await getIdToken(API_URL);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password })
  });
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const validateSession = async (route: string, token: string) => {
  const res = await fetch(`${API_URL}/auth/${route}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return await res.json();
};