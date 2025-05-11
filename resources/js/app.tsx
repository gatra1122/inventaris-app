import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import '../css/app.css'
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
            <ToastContainer />
        </>
    );
};

export default App;