import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/token/', { username, password });
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            navigate('/home');
        } catch (error) {
            alert("Invalid Credentials!");
        }
    };

    const registerUser = async (username, email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register/', { username, email, password });
            setAuthTokens({ refresh: response.data.refresh, access: response.data.access });
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify({ refresh: response.data.refresh, access: response.data.access }));
            navigate('/home');
        } catch (error) {
            alert(error.response?.data?.error || "Registration failed");
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/');
    };

    const updateToken = async () => {
        if (!authTokens) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', { refresh: authTokens.refresh });
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
        } catch (error) {
            logoutUser();
        }
        if (loading) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loading) updateToken();
        const interval = setInterval(() => {
            if (authTokens) updateToken();
        }, 1000 * 60 * 4); // 4 minutes
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, registerUser, logoutUser }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
