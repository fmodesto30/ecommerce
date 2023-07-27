import checkToken from './services/checkTokenAPI.js';

const checkTokenValidity = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false; // Token not available
  }

  try {
    const response = await checkToken.post('http://localhost:8080/v1/checkToken', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.status === 200; // Token is valid
  } catch (error) {
    return false; // Token validation failed
  }
}

export default checkTokenValidity;