import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../types";

interface AuthContextType {
    isLoading: boolean,
    user: UserType | null,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>,
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:8000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<UserType | null>(null);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            console.log(response);
            // console.log(`${email}, ${password}`);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }
    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password,
                password_confirmation
            });

            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/logout`);

            console.log(response);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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