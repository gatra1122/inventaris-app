import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/kategori', label: 'Kategori' },
    { to: '/supplier', label: 'Supplier' },
    { to: '/barang', label: 'Barang' },
    { to: '/user', label: 'User' },
]

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-100 p-4 border-r">
            <ul className="space-y-2">
                {navItems.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200' : ''}`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default Sidebar
