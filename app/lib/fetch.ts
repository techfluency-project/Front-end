export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const enhancedInit: RequestInit = {
    credentials: 'include',
    ...init,
  };

  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
  const response = await fetch(`http://localhost:5092${url}`, enhancedInit);

  // Log basic response info
  console.log('[fetchWithAuth] URL:', url);
  console.log('[fetchWithAuth] Status:', response.status);
  console.log('[fetchWithAuth] Headers:', Array.from(response.headers.entries()));

  // Try to parse and log JSON body if possible
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const cloned = response.clone();
      const body = await cloned.json();
      console.log('[fetchWithAuth] JSON body:', body);
    } catch (err) {
      console.warn('[fetchWithAuth] Failed to parse JSON body:', err);
    }
  } else {
    console.log('[fetchWithAuth] Non-JSON response body not logged');
  }

  // 401 handling
  if (response.status === 401) {
    handle401();
  }

  // 400 + "user not found" handling
  if (response.status === 400) {
    window.location.href = '/signin';
    // try {
    //   const data = await response.clone().json();
    //   if (typeof data.message === 'string' && data.message.toLowerCase().includes('user not found')) {
    //     handle401();
    //   }
    // } catch {
    //   // ignore parse errors
    // }
  }

  return response;
};

const handle401 = () => {
  console.warn('Unauthorized! Redirecting to login...');
  window.location.href = '/signin';
};
