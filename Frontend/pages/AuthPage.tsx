
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPanel from '../components/AuthPanel';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            if (user.role === 'STORE') {
                navigate('/store-panel');
            } else {
                navigate('/map');
            }
        }
    }, [user, navigate]);

    return <AuthPanel />;
};

export default AuthPage;
