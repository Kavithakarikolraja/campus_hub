import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Users, Lightbulb, Palette, MessageSquare, Trophy, Star } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const hubs = [
        { id: 'technical', title: 'Tech Skills', description: 'Find peers expert in coding, software, and hardware.', icon: <Code2 size={40} />, color: 'var(--primary)' },
        { id: 'communication', title: 'Communication Skills', description: 'Improve public speaking, presentation, and leadership.', icon: <Users size={40} />, color: 'var(--secondary)' },
        { id: 'aptitude', title: 'Aptitude Training', description: 'Train logic, quantitative, and analytical reasoning.', icon: <Lightbulb size={40} />, color: 'var(--accent)' },
        { id: 'project-collab', title: 'Project Collaboration', description: 'Combine with other department people to build incredible web projects.', icon: <Users size={40} />, color: 'var(--success)' }
    ];

    const [topUsers, setTopUsers] = useState([]);
    useEffect(() => {
        const fetchTop = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/users/leaderboard', config);
                setTopUsers(data.slice(0, 3)); // Only take top 3 for Dashboard
            } catch (err) {
                console.error(err);
            }
        };
        fetchTop();
    }, [user.token]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    };

    return (
        <motion.div
            className="animate-fade-in"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            <motion.div
                variants={itemVariants}
                className="glass-panel text-center mb-4"
                style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(239, 68, 68, 0.1))',
                    border: '1px solid rgba(249, 115, 22, 0.2)',
                    boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)'
                }}
            >
                <h1 style={{ fontSize: '2.5rem', background: '-webkit-linear-gradient(0deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Welcome to CampusHub, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-secondary mb-3" style={{ fontSize: '1.1rem' }}>Discover expert peers below and request skill swaps.</p>
                <div className="flex justify-center gap-3">
                    <Link to="/chat" className="btn btn-primary" style={{ position: 'relative', overflow: 'hidden' }}>
                        <span style={{ position: 'relative', zIndex: 1 }}>Join Peer-to-Peer Chat</span>
                        <motion.div
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', zIndex: 0 }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        />
                    </Link>
                    <Link to="/profile" className="btn btn-outline">My Profile</Link>
                </div>
            </motion.div>

            {/* Top Rank Widget */}
            {topUsers.length > 0 && (
                <motion.div variants={itemVariants} className="glass-panel mb-4" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <div className="flex justify-between align-center mb-3">
                        <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)' }}>
                            <Trophy size={24} /> Top Providers
                        </h2>
                        <Link to="/leaderboard" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>View All Rankings &rarr;</Link>
                    </div>
                    <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                        {topUsers.map((topUser, idx) => (
                            <div key={topUser._id} style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32' }}>
                                    #{idx + 1}
                                </div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {topUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{topUser.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={12} fill="var(--warning)" color="var(--warning)" /> {topUser.averageRating > 0 ? parseFloat(topUser.averageRating).toFixed(1) : 'New'} • {topUser.points} pts
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {hubs.map((hub) => (
                    <motion.div
                        key={hub.id}
                        variants={itemVariants}
                        className="glass-panel"
                        style={{ position: 'relative', overflow: 'hidden', padding: '2rem', borderTop: `4px solid ${hub.color}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                        whileHover={{ y: -8, scale: 1.02, boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 25px ${hub.color}33` }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        <div style={{ padding: '1rem', borderRadius: '50%', background: `${hub.color}22`, color: hub.color, marginBottom: '1rem' }}>
                            {hub.icon}
                        </div>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{hub.title}</h2>
                        <p className="text-secondary" style={{ marginBottom: '1.5rem', flex: 1 }}>{hub.description}</p>

                        <Link
                            to={hub.id === 'project-collab' ? '/project-collab' : `/matches`}
                            className="btn w-100"
                            style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = hub.color; e.currentTarget.style.borderColor = hub.color }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                        >
                            Explore Hub
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;

