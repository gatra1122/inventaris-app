import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { authToken, isLoading, user } = useAuth();

    useEffect(() => {
      if(!authToken && !isLoading){
        navigate('/login');
      }
    }, [])
    
    if (!authToken && !isLoading) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 bg-white">
                    <Outlet />
                </main>
            </div>
            <footer className="bg-gray-100 text-center py-4 border-t text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Idris Gatra Putra. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;
