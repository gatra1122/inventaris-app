import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            <aside className="w-64 bg-gray-100 p-4 border-r">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/kategori"
                            className={({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                            Kategori
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/supplier"
                            className={({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                            Supplier
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/user"
                            className={({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`}
                        >
                            User
                        </NavLink>
                    </li>
                </ul>
            </aside>
        </>
    )
}

export default Sidebar
