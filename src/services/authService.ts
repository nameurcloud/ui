//const API_URL = import.meta.env.VITE_API_URL;
const API_URL  = '/api';
export const registerUser = async (email: string, password: string,fname: string,lname:string,mobile:string,dob:string) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password,fname,lname,mobile,dob })
  });
  return res;
};

export const loginUser = async (email: string, password: string) => {
  console.log(`${API_URL}/login`)
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  console.log("NM : " + res.body)
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const validateSession = async (route: string, token: string) => {
  const res = await fetch(`${API_URL}/${route}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return await res.json();
};