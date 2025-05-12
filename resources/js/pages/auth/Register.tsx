import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface formData {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
}

const Register = () => {
    const { register } = useAuth();

    const [formData, setFormData] = useState<formData>({
        name: 'idris',
        email: 'idris@email.com',
        password: '1234',
        password_confirmation: '1234'
    })

    const handleOnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation);
        } catch (error) {
            console.log(`Authentication Error: ${error}`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
                        <input
                            name='name'
                            onChange={handleOnChangeInput}
                            value={formData.name}
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
                        <input
                            name='email'
                            onChange={handleOnChangeInput}
                            value={formData.email}
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            name='password'
                            onChange={handleOnChangeInput}
                            value={formData.password}
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1" htmlFor="password_confirmation">Confirm Password</label>
                        <input
                            name='password_confirmation'
                            onChange={handleOnChangeInput}
                            value={formData.password_confirmation}
                            type="password"
                            id="password_confirmation"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="********"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                    >
                        Register
                    </button>
                    <div className='flex justify-center'>
                        <Link to={'/login'}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
