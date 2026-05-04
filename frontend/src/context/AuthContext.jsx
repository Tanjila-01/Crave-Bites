import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            await api.post('/auth/token/', { username, password });
            
            // Fetch user profile from backend instead of decoding JWT
            const userResponse = await api.get('/auth/me/');
            setUser(userResponse.data);
            setAuthTokens(true); // Just a flag to know we're logged in
            localStorage.setItem('isLoggedIn', 'true');
            
            navigate('/home');
        } catch (error) {
            toast.error("Invalid Credentials!");
        }
    };

    const registerUser = async (username, email, password) => {
        try {
            const response = await api.post('/auth/register/', { 
                username, 
                email, 
                password,
                confirm_password: password 
            });
            setUser(response.data.user);
            setAuthTokens(true);
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/home');
        } catch (error) {
            toast.error(error.response?.data?.error || "Registration failed");
        }
    };

    const logoutUser = async () => {
        try {
            await api.post('/auth/logout/');
        } catch (e) {
            console.error(e);
        }
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    const updateToken = async () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }
        
        try {
            await api.post('/auth/token/refresh/');
            const userResponse = await api.get('/auth/me/');
            setUser(userResponse.data);
            setAuthTokens(true);
        } catch (error) {
            setAuthTokens(null);
            setUser(null);
            localStorage.removeItem('isLoggedIn');
        } finally {
            if (loading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (loading) updateToken();
        const interval = setInterval(() => {
            if (localStorage.getItem('isLoggedIn')) updateToken();
        }, 1000 * 60 * 4); // 4 minutes
        return () => clearInterval(interval);
    }, [loading]);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, registerUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
