// src/services/tokenService.ts
export const getBackendToken = async (): Promise<string> => {
    const res = await fetch('https://api.nameurcloud.com/api/get-token'); // this will go to your Express route
    if (!res.ok) throw new Error('Token fetch failed');
    const data = await res.json();
    return data.token;
  };
  