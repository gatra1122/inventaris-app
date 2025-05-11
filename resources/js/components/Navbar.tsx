import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const { logout, user } = useAuth();
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <div className="text-lg font-semibold">My Dashboard</div>
                <div className='inline-flex gap-2 justify-center items-center'>
                    <span>Hallo, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500"
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </>
    )
}

export default Navbar