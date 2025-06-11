import axios from 'axios';

export const checkAndRefreshToken = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return null;

    // Decode the JWT to check expiration
    const [, payloadBase64] = accessToken.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp > currentTime) {
        // Token is still valid
        return accessToken;
    }

    try {
        // Refresh the token
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/refresh-token`, {
            accessToken,
        });
        const newAccessToken = response.data.accessToken;

        // Save the new token
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirect to login page
    }

    return null;
};
