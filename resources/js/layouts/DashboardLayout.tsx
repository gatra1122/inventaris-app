import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { authToken, isLoading, user } = useAuth();

    useEffect(() => {
        if (!authToken && !isLoading) {
            navigate('/login');
        }
    }, [])

    if (!authToken && !isLoading) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 overflow-auto bg-blue-50 rounded-t-4xl px-8 py-12 sm:px-10 lg:px-12">
                    <Outlet />
                </main>
                <footer className="bg-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Idris Gatra Putra. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
