import { useState } from "react";
import {
    Squares2X2Icon,
    ArchiveBoxIcon,
    TagIcon,
    BuildingStorefrontIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import {
    Squares2X2Icon as Squares2X2IconSolid,
    Bars3Icon,
    MagnifyingGlassIcon,
    ArchiveBoxIcon as ArchiveBoxIconSolid,
    TagIcon as TagIconSolid,
    BuildingStorefrontIcon as BuildingStorefrontIconSolid,
    UsersIcon as UsersIconSolid
} from "@heroicons/react/24/solid";
import { Link, NavLink } from "react-router-dom";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const navigation = [
        {
            name: "Dashboard", href: "/",
            icon: <Squares2X2Icon className="w-6 h-6" />, iconSolid: <Squares2X2IconSolid className="w-6 h-6" />
        },
        {
            name: "Barang", href: "/barang",
            icon: <ArchiveBoxIcon className="w-6 h-6" />, iconSolid: <ArchiveBoxIconSolid className="w-6 h-6" />
        },
        {
            name: "Kategori", href: "/kategori",
            icon: <TagIcon className="w-6 h-6" />, iconSolid: <TagIconSolid className="w-6 h-6" />
        },
        {
            name: "Supplier", href: "/supplier",
            icon: <BuildingStorefrontIcon className="w-6 h-6" />, iconSolid: <BuildingStorefrontIconSolid className="w-6 h-6" />
        },
        {
            name: "Users", href: "/user",
            icon: <UsersIcon className="w-6 h-6" />, iconSolid: <UsersIconSolid className="w-6 h-6" />
        },
    ];

    const filteredNavigation = navigation.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function classNames(...classes: (string | undefined)[]): string {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <aside
            className={classNames(
                "bg-white p-4 hidden md:flex flex-col relative transition-all duration-300 ease-in-out",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="btn-transparent absolute top-4 -right-10 z-10 hover:opacity-50 transition"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <Bars3Icon className="w-7" />
            </button>

            <div className={classNames("mb-6 whitespace-nowrap", collapsed ? "hidden" : "block")}>
                <Link to={"/"} target="_blank"><h2 className="text-center">Next App</h2></Link>
            </div>
            <div className={classNames("mb-6 whitespace-nowrap", collapsed ? "block" : "hidden")}>
                <Link to={"/"} target="_blank"><h2 className="text-center">NA</h2></Link>
            </div>

            {/* Search Input */}
            <div className="relative">
                {collapsed ? (
                    <div className="flex justify-center mb-2 h-10">
                        <button
                            className="!bg-transparent p-2 rounded"
                            onClick={() => setCollapsed(false)}
                            title="Expand to search"
                        >
                            <MagnifyingGlassIcon className="w-6 h-6 text-blue-500" />
                        </button>
                    </div>
                ) : (
                    <div className="inline-flex items-center w-full h-10 mb-2">
                        <div className="bg-gray-50 p-2 rounded-md rounded-r-none">
                            <MagnifyingGlassIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-md rounded-l-none h-full px-2">
                            <input
                                placeholder="Cari menu..."
                                className="w-full h-full focus:outline-none bg-transparent"
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            />
                        </div>
                    </div>
                )}

                {/* Dropdown Panel */}
                {!collapsed && searchTerm && isFocused && filteredNavigation.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white border-none rounded shadow-md">
                        {filteredNavigation.map(item => (
                            <NavLink key={item.name} to={item.href} onClick={() => setSearchTerm("")}>
                                <li className="px-4 py-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2">
                                    {item.icon}
                                    <span>{item.name}</span>
                                </li>
                            </NavLink>
                        ))}
                    </ul>
                )}
            </div>

            {/* Main Menu */}
            <nav>
                <ul>
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-2 my-2 text-md flex items-center gap-3 ${isActive ? 'bg-blue-500 text-white shadow-md' : 'text-gray-800 hover:bg-blue-500 hover:text-white'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span>
                                        {isActive ? item.iconSolid : item.icon}
                                    </span>
                                    <span className="overflow-hidden">
                                        {!collapsed && item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;