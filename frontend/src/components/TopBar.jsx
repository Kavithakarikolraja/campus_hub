import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, Bell, ShieldAlert, LogOut, Moon, Sun, MessageSquareDiff } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const TopBar = ({ setMobileOpen }) => {
    const { user, logout, socket } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if (!user) return;
        const fetchNotifs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/notifications', config);
                setNotifications(data.filter(n => !n.isRead));
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, [user]);

    // Track unread messages globally via Socket
    useEffect(() => {
        if (!socket || !user) return;

        const handleReceiveMessage = (data) => {
            // Automatically clear if the user is literally looking at the chat page currently
            if (location.pathname !== '/chat') {
                setUnreadMessages(prev => prev + 1);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [socket, user, location.pathname]);

    // Reset unread count instantly when they navigate to chat
    useEffect(() => {
        if (location.pathname === '/chat') {
            setUnreadMessages(0);
        }
    }, [location.pathname]);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    if (!user) return null; // Or return a simpler top bar for guests

    return (
        <header className="topbar-wrapper">
            <div className="flex align-center gap-3">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="menu-btn"
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: window.innerWidth > 1024 ? 'none' : 'block' }}
                >
                    <Menu size={24} />
                </button>
                {/* Search Bar / Breadcrumbs could go here */}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: window.innerWidth > 768 ? 'block' : 'none' }}>
                    Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</strong>
                </span>
            </div>

            <div className="flex align-center gap-4">
                <Link to="/swaps" title="Swap Requests" style={{ position: 'relative', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    <Bell size={20} className="hover-glow" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'} />
                    {notifications.length > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--bg-color)' }}>
                            {notifications.length}
                        </span>
                    )}
                </Link>

                {/* Chat Unread Badge */}
                <Link to="/chat" title="Unread Messages" style={{ position: 'relative', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    <MessageSquareDiff size={20} className="hover-glow" style={{ transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'} />
                    {unreadMessages > 0 && (
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--success)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid var(--bg-color)' }}>
                            {unreadMessages}
                        </span>
                    )}
                </Link>

                {/* Admin Link if applicable */}
                {user.role === 'admin' && (
                    <Link to="/admin" title="Admin Dashboard" style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center' }}>
                        <ShieldAlert size={20} className="hover-glow" />
                    </Link>
                )}

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <LogOut size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', display: window.innerWidth > 640 ? 'block' : 'none' }}>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;

