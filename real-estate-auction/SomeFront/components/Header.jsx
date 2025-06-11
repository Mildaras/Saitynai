import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken');

    const handleLogout = () => {
        // Clear token and user data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="logo">Real Estate Auctions</h1>
                <button
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
                >
                    ☰
                </button>
                <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/regions">Regions</Link></li>
                        {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                        {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
                        {isLoggedIn && (
                            <li>
                                <button onClick={handleLogout} className="btn-logout">Logout</button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
