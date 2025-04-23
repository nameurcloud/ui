const API_URL = import.meta.env.VITE_API_URL;
import { getBackendToken } from './tokenService';

export const registerUser = async (email: string, password: string,fname: string,lname:string,mobile:string,dob:string) => {
  const token = await getBackendToken();
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
  const token = await getBackendToken();
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