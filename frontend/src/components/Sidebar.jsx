import { Link, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    Code2,
    Users,
    Lightbulb,
    GitMerge,
    Search as SearchIcon,
    FileBox,
    MessageSquareDiff,
    ArrowLeftRight,
    CalendarClock,
    UserCircle,
    X,
    ShieldCheck,
    MessageCircle,
    Trophy
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [pendingSwapsCount, setPendingSwapsCount] = useState(0);

    // Poll for pending received swap requests
    useEffect(() => {
        if (!user) return;

        const fetchPendingSwaps = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/swaps', config);
                const pending = data.received.filter(req => req.status === 'pending').length;
                setPendingSwapsCount(pending);
            } catch (error) {
                console.error("Failed to fetch pending swaps");
            }
        };

        fetchPendingSwaps();
        const interval = setInterval(fetchPendingSwaps, 5000); // 5s polling matches topbar speed
        return () => clearInterval(interval);
    }, [user]);

    const NavLink = ({ to, icon: Icon, label, badgeCount }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
        return (
            <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
                    <Icon className="icon" size={20} />
                    <span>{label}</span>
                </div>
                {badgeCount > 0 && (
                    <span style={{
                        background: 'var(--danger)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        marginLeft: 'auto'
                    }}>
                        {badgeCount}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <aside className={`sidebar-wrapper ${mobileOpen ? 'mobile-open' : ''}`}>
            {/* Logo Area */}
            <div style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid var(--border-color)' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Code2 size={18} color="white" />
                    </div>
                    Campus<span style={{ color: 'var(--primary)', fontWeight: '300' }}>Hub</span>
                </Link>
                {/* Mobile Close Button */}
                <button
                    className="lg-hidden"
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: window.innerWidth > 1024 ? 'none' : 'block' }}
                    onClick={() => setMobileOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation Menus */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', marginTop: '10px' }}>
                    Main
                </div>
                <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />



                <div style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', marginTop: '20px' }}>
                    Network & Community
                </div>
                <NavLink to="/matches" icon={GitMerge} label="Skill Exchange" />
                <NavLink to="/project-collab" icon={Users} label="Project Collaboration" />
                <NavLink to="/community" icon={MessageCircle} label="Community Feed" />
                <NavLink to="/leaderboard" icon={Trophy} label="Top Providers" />

                <div style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', marginTop: '20px' }}>
                    Peer-to-Peer
                </div>
                <NavLink to="/swaps" icon={ArrowLeftRight} label="Swap Requests" badgeCount={pendingSwapsCount} />
                <NavLink to="/chat" icon={MessageSquareDiff} label="Realtime Chat" />
                <NavLink to="/sessions" icon={CalendarClock} label="My Sessions" />

                <div style={{ padding: '0 20px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px', marginTop: '20px' }}>
                    Assets
                </div>
                <NavLink to="/resources" icon={FileBox} label="Resource Library" />
                <NavLink to="/profile" icon={UserCircle} label="My Profile" />


            </div>
        </aside>
    );
};

export default Sidebar;

