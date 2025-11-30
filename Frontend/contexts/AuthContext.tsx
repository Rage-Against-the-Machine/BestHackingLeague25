
import React, { createContext, useState, useContext, ReactNode, FC } from 'react';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

type UserRole = 'GUEST' | 'CLIENT' | 'STORE';

interface AuthContextType {
    user: UserProfile | null;
    userRole: UserRole;
    userName: string;
    isLoading: boolean;
    login: (username: string, password: string, role: 'CLIENT' | 'STORE') => Promise<UserProfile>;
    register: (email: string, password: string, name: string, role: 'CLIENT' | 'STORE', location?: string) => Promise<UserProfile>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const userRole: UserRole = user?.role || 'GUEST';
    const userName = user?.name || '';

    const login = async (username: string, password: string, role: 'CLIENT' | 'STORE') => {
        setIsLoading(true);
        try {
            const loggedInUser = await userService.login(username, password, role);
            setUser(loggedInUser);
            return loggedInUser;
        } catch(e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string, role: 'CLIENT' | 'STORE', location?: string) => {
        setIsLoading(true);
        try {
            const newUser = await userService.register(email, password, name, role, location);
            setUser(newUser);
            return newUser;
        } catch(e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        userRole,
        userName,
        isLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
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
