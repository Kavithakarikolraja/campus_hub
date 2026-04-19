import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Medal } from 'lucide-react';

const Leaderboard = () => {
    const { user } = useContext(AuthContext);
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/users/leaderboard', config);
                setTopUsers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [user.token]);

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { type: 'spring' } } };

    if (loading) return <div className="text-center mt-4 text-warning">Loading Rankings...</div>;

    return (
        <motion.div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }} initial="hidden" animate="show" variants={containerVariants}>
            <div className="text-center mb-4">
                <h1 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '2.5rem' }}>
                    <Trophy size={40} /> Top Providers
                </h1>
                <p className="text-secondary">Ranked based on average rating, session history, and total community points.</p>
            </div>

            <div className="flex flex-col gap-3">
                {topUsers.map((topUser, index) => {
                    let medalColor = 'transparent';
                    if (index === 0) medalColor = '#FFD700'; // Gold
                    else if (index === 1) medalColor = '#C0C0C0'; // Silver
                    else if (index === 2) medalColor = '#CD7F32'; // Bronze

                    return (
                        <motion.div key={topUser._id} variants={itemVariants} className="glass-panel hover-glow" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: index < 3 ? `4px solid ${medalColor}` : '4px solid transparent' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: index < 3 ? medalColor : 'var(--text-secondary)', width: '30px', textAlign: 'center' }}>
                                #{index + 1}
                            </div>
                            
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: index < 3 ? `${medalColor}33` : 'var(--primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: index < 3 ? medalColor : 'var(--primary)' }}>
                                {topUser.name.charAt(0).toUpperCase()}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {topUser.name}
                                    {topUser.isVerifiedMentor && (
                                        <span title="Verified Mentor" style={{ fontSize: '0.75rem', background: 'var(--accent)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>Verified</span>
                                    )}
                                </h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{topUser.department}</div>
                            </div>

                            <div className="flex gap-4" style={{ textAlign: 'center' }}>
                                <div>
                                    <div style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                        <Star size={16} fill="var(--warning)" /> {topUser.averageRating > 0 ? parseFloat(topUser.averageRating).toFixed(1) : 'New'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{topUser.totalReviews} Reviews</div>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                                    <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                        <TrendingUp size={16} /> {topUser.points}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Points</div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {topUsers.length === 0 && (
                    <div className="text-center text-secondary mt-4">No users mapped yet. Start swapping to climb the ranks!</div>
                )}
            </div>
        </motion.div>
    );
};

export default Leaderboard;

