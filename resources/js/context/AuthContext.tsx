import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    authToken: string | undefined,
    isLoading: boolean,
    user: UserType | null,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>,
    logout: () => Promise<void>
}

interface LoginResponse {
    status: boolean;
    message: string;
    token: string;
}
interface RegisterResponse {
    status: boolean;
    message: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<UserType | null>(null);
    const [authToken, setAuthToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            setAuthToken(token);
        } else {
            navigate('login');
        }
    }, [])


    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data.status) {
                Cookies.set('authToken', response.data.token, { expires: 1 });
                setAuthToken(response.data.token);
                console.log('Login berhasil')
                navigate('/');
            } else {
                console.log('Login gagal')
            }
            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post<RegisterResponse>(`${API_URL}/register`, {
                name,
                email,
                password,
                password_confirmation
            });

            if (response.data.status) {
                navigate('/login');
            }

            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setAuthToken(undefined);
            Cookies.remove('authToken');
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, authToken }}>
            {isLoading ? <h1>Loading...</h1> : children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};