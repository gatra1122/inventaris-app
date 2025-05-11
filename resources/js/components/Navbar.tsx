import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const { logout } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <div className="text-lg font-semibold">My Dashboard</div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </nav>
        </>
    )
}

export default Navbar