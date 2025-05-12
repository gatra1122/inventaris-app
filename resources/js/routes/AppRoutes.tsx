import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/dashboard/Dashboard';
import User from '../pages/dashboard/User';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import NotFound from '../pages/NotFound';
import Kategori from '../pages/dashboard/Kategori';
import Supplier from '../pages/dashboard/Supplier';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Layout Utama */}
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="user" element={<User />} />
                <Route path="kategori" element={<Kategori />} />
                <Route path="supplier" element={<Supplier />} />
            </Route>

            {/* Layout Auth */}
            <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
