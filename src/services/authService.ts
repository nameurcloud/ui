const API_URL = import.meta.env.VITE_API_URL;
export const registerUser = async (email: string, password: string,fname: string,lname:string,mobile:string,dob:string,plan:string) => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password,fname,lname,mobile,dob,plan })
  });
  return res;
};

export const loginUser = async (email: string, password: string) => {
  const logoutmsg = localStorage.getItem("logoutmsg")
  if(logoutmsg){ localStorage.removeItem("logoutmsg")}
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
