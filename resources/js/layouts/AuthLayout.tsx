import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
            <h2>Welcome</h2>
            <Outlet />
        </div>
    );
};

export default AuthLayout;