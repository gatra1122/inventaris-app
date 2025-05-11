import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
    const { authToken, isLoading } = useAuth();

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