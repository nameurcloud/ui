const API_URL = import.meta.env.VITE_API_URL;
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
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
};

export const getToken = () => {
  return {'token' : localStorage.getItem('token'), 'email' :  localStorage.getItem('email') };
};

export const validateSession = async (route: string, token: string) => {
  const res = await fetch(`${API_URL}/${route}`, {
    method : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token })
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return await res.json();
};