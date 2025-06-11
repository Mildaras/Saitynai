import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredRole }) => {
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchUserProfile();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) return <div>Loading...</div>;
    if (!token || (requiredRole && userRole !== requiredRole)) return <Navigate to="/login" />;
    return children;
};

export default ProtectedRoute;
