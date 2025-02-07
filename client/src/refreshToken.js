const BASE_URL = import.meta.env.VITE_BASE_URL;

const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, user needs to log in');
      return null;
    }

    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      return data.token;
    } else {
      console.error('Token refresh failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export default refreshToken;
