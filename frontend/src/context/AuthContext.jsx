import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Global Socket Setup
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('update_online_users', (users) => {
            setOnlineUsers(users);
        });

        return () => newSocket.close();
    }, []);

    // Check if user is logged in on load
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    // Register user with socket backend
    useEffect(() => {
        if (user && socket) {
            socket.emit("setup_user", user._id);
        }
    }, [user, socket]);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/api/users/login', {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (name, email, password, department, skillsOffered, skillsWanted) => {
        try {
            const { data } = await axios.post('/api/users/register', {
                name,
                email,
                password,
                department,
                skillsOffered,
                skillsWanted,
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (data) => {
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, onlineUsers, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

