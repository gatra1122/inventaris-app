import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axiosClient from "../utils/axios";
import { UserType } from "../types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Loading from "../components/Loading";
import { useQuery } from "@tanstack/react-query";

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
    user: UserType;
}
interface RegisterResponse {
    status: boolean;
    message: string;
}
interface MeResponse {
    status: boolean;
    message: string;
    user: UserType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserType | null>(null);
    const [authToken, setAuthToken] = useState<string | undefined>(undefined);

    const { data, error, isFetching } = useQuery({
        queryKey: ['me'],
        queryFn: () => {
            return axiosClient.get('/me').then(response => {
                setUser(response.data.user);
                setIsLoading(false);
                return response.data.user;
            }).catch(error => {
                throw error;
            })
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const token = Cookies.get('authToken');
        if (token) {
            setAuthToken(token);
        } else {
            setAuthToken(undefined);
            setIsLoading(false);
        }
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.post<LoginResponse>('/login', {
                email,
                password
            });

            if (response.data.status) {
                Cookies.set('authToken', response.data.token, { expires: 1 });
                setAuthToken(response.data.token);
                setUser(response.data.user);
                navigate('/');
            }
        } catch (error: any | AxiosError) {
            toast.error(error.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        setIsLoading(true);
        try {
            const response = await axiosClient.post<RegisterResponse>('/register', {
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
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        try {
            await axiosClient.post('/logout');
            setAuthToken(undefined);
            Cookies.remove('authToken');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading, authToken }}>
            {isLoading ? <Loading /> : children}
            {/* {children} */}
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