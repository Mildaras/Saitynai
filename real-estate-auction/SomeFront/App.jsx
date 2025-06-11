import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import RegionList from './components/RegionList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';

const App = () => {
    return (
        <Router>
            <Header />
                <div>
                    <main>
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <MemberDashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/admin-dashboard" element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            
                        </Routes>
                    </main>
                </div>
            <Footer />
        </Router>
    );
};

export default App;

