import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const refreshToken = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/refresh-token`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken); // Update token in local storage
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export default refreshToken;
