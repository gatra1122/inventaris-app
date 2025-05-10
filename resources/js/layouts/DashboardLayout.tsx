import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Logika logout bisa ditambahkan di sini
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
                <div className="text-lg font-semibold">My Dashboard</div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-100 p-4 border-r">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/"
                                className="block px-4 py-2 rounded hover:bg-gray-200"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/user"
                                className="block px-4 py-2 rounded hover:bg-gray-200"
                            >
                                User
                            </Link>
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-white">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 text-center py-4 border-t text-sm text-gray-600">
                &copy; {new Date().getFullYear()} My App. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardLayout;
