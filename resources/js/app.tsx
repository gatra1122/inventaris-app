import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import '../css/app.css'
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { ReactQueryProvider } from './context/ReactQuery';

const App = () => {
    return (
        <>
            <ReactQueryProvider>
                <BrowserRouter>
                    <AuthProvider>
                        <AppRoutes />
                    </AuthProvider>
                </BrowserRouter>
            </ReactQueryProvider>
            <ToastContainer />
        </>
    );
};

export default App;