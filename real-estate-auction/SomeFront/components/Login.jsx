import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, { email, password });
            const { accessToken } = response.data;

            // Save the JWT token to localStorage
            localStorage.setItem('accessToken', accessToken);

            // Fetch user profile to determine role
            const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const { role } = profileResponse.data;
            console.log('User role:', role);

            // Redirect based on user role
            if (role === 'admin') {
                navigate('/admin-dashboard'); // Example admin dashboard
            } else {
                navigate('/'); // Example member home page
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            setMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
