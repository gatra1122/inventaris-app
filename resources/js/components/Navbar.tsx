import { Disclosure, Menu, MenuButton, MenuItems, MenuItem, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const userClient = {
        name: user?.name,
        imageUrl:
            '/avatar.png',
    }

    const userNavigation = [
        { name: 'Your Profile', href: `#${user?.id}` },
        // { name: 'Sign out', href: '/logout' },
    ]

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Disclosure as="nav" className="bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center float-end">
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div>
                                <p className='text-gray-800'>{userClient.name}</p>
                            </div>
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="!bg-transparent relative flex max-w-xs items-center rounded-full text-sm focus:outline-hidden">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img src={userClient.imageUrl} className='size-8 rounded-full' />
                                        {/* // <Image alt='Avatar' src={userClient.imageUrl} className='size-8 rounded-full' width={64} height={64}  /> */}
                                    </MenuButton>
                                </div>
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                >
                                    {userNavigation.map((item) => (
                                        <MenuItem key={item.name}>
                                            <a
                                                href={item.href}
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                {item.name}
                                            </a>
                                        </MenuItem>
                                    ))}
                                    <MenuItem key='logout'>
                                        <a
                                            onClick={handleLogout}
                                            className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                        >
                                            Logout
                                        </a>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="md:hidden">
                <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                        <div className="shrink-0">
                            <img src={userClient.imageUrl} className='size-8 rounded-full' />
                            {/* <Image alt='Avatar' src={userClient.imageUrl} className='size-10 rounded-full' width={64} height={64}  /> */}
                        </div>
                        <div className="ml-3">
                            <div className="text-base/5 font-medium text-white">{userClient.name}</div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                        {userNavigation.map((item) => (
                            <DisclosureButton
                                key={item.name}
                                as="a"
                                href={item.href}
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}

export default Navbar;