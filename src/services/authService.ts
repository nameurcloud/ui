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
};

export const navigator = (path: string, navigate: (to: string) => void) => {
  const token = localStorage.getItem("token");

  fetch(`${API_URL}/insider/${path}`, {
    method: "GET",
    headers: {
      "X-App-Auth": token || "",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        localStorage.setItem("logoutmsg", "Unauthorized Access. Please login.");
        navigate("/logout");
        logoutUser();
        //throw new Error("Unauthorized");
      }
    })
    .then((_data) => {
      //console.log("Access granted:", data);
    })
    .catch((_error) => {
      localStorage.setItem("logoutmsg", "Error Validating Access. Please login.");
      navigate("/logout");
      logoutUser
      //console.error("Error:", error);
    });
};
