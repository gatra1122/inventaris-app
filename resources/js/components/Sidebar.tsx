import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
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
        </>
    )
}

export default Sidebar