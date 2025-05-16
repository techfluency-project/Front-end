export const fetchWithAuth = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
  const enhancedInit: RequestInit = {
    credentials: 'include',
    ...init,
  };

  return fetch(`http://localhost:5092${input}`, enhancedInit).then(response => {
    if (response.status === 401) {
      handle401()
    }
    
    return response;
  });
};


const handle401 = () => {
  console.warn("Unauthorized! Redirecting to login...");
  window.location.href = "/signin";
};
