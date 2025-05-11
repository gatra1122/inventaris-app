import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
    const navigate = useNavigate();
    const { authToken, isLoading } = useAuth();

    useEffect(() => {
        if (authToken && !isLoading) {
            navigate('/');
        }
    }, [])

    if (authToken && !isLoading) {
        return null;
    }
    
    return (
        <>
            <Outlet />
        </>
    );
};

export default AuthLayout;