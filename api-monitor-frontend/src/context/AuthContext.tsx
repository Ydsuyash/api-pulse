import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api, { login as apiLogin, register as apiRegister, getMe } from '../services/api';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    const { data } = await getMe();
                    setUser(data);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const { data } = await apiLogin(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success('Successfully logged in!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (credentials: any) => {
        try {
            const { data } = await apiRegister(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success('Account created successfully!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            register,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
