import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GitMerge, UserIcon, RefreshCw, MessageSquare } from 'lucide-react';

const Matches = () => {
    const { user, onlineUsers } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showRateModal, setShowRateModal] = useState(false);
    const [rateTarget, setRateTarget] = useState(null);
    const [userRating, setUserRating] = useState('5');
    const [userFeedback, setUserFeedback] = useState('');

    const fetchMatches = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/users/matches', config);
            setMatches(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch matches");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
    }, [user.token]);

    const handleRateSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/users/${rateTarget._id}/rate`, {
                rating: userRating,
                feedback: userFeedback
            }, config);
            alert("Rating recorded successfully!");
            setShowRateModal(false);
            setRateTarget(null);
            setUserFeedback('');
            setUserRating('5');
            fetchMatches(); // Refresh to show new average
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit rating");
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: 'spring' } } };

    if (loading) return <div className="text-center mt-4">Finding perfect skill matches...</div>;

    return (
        <motion.div className="animate-fade-in" initial="hidden" animate="show" variants={containerVariants}>
            <div className="glass-panel text-center mb-4" style={{ borderTop: `4px solid var(--primary)` }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <GitMerge size={36} /> Skill Exchange
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem' }}>
                    These peers offer skills you want to learn, and they want to learn the skills you offer!
                </p>
            </div>

            {matches.length === 0 && (
                <div className="text-center text-secondary mb-4">
                    <p style={{ fontSize: '1.1rem' }}>No live skill exchange partners found right now. Showing demo users below.</p>
                </div>
            )}

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {/* Fallback Demos if no real matches */}
                {matches.length === 0 && (
                    <>
                        <motion.div variants={itemVariants} className="glass-panel" style={{ flex: '1 1 320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', opacity: 0.8 }}>
                            <div className="flex justify-between align-center mb-3">
                                <div className="flex align-center gap-2">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: `var(--primary-alpha, rgba(249, 115, 22, 0.2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>A</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>Alex Johnson (Demo)</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Mechanical Engineering •
                                            <span style={{ color: 'var(--warning)', marginLeft: '4px' }}>★ 4.8</span> (12 reviews)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They offer to teach you:</div>
                                <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                                    <span style={{ background: `var(--primary-alpha, rgba(249, 115, 22, 0.15))`, color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(249, 115, 22, 0.3)` }}>Technical Java</span>
                                    <span style={{ background: `var(--primary-alpha, rgba(249, 115, 22, 0.15))`, color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(249, 115, 22, 0.3)` }}>CAD Design</span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They want to learn from you:</div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    <span style={{ background: `var(--accent-alpha, rgba(16, 185, 129, 0.15))`, color: 'var(--accent)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(16, 185, 129, 0.3)` }}>Public Speaking</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <Link to={`/swaps`} state={{ targetUser: { _id: 'demo1', name: 'Alex Johnson' } }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent)', color: 'white' }}>
                                    <RefreshCw size={16} /> Request Pass
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-panel" style={{ flex: '1 1 320px', padding: '1.5rem', display: 'flex', flexDirection: 'column', opacity: 0.8 }}>
                            <div className="flex justify-between align-center mb-3">
                                <div className="flex align-center gap-2">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: `var(--primary-alpha, rgba(249, 115, 22, 0.2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>S</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>Sarah Lee (Demo)</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Business Management •
                                            <span style={{ color: 'var(--warning)', marginLeft: '4px' }}>★ 5.0</span> (4 reviews)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They offer to teach you:</div>
                                <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                                    <span style={{ background: `var(--primary-alpha, rgba(249, 115, 22, 0.15))`, color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(249, 115, 22, 0.3)` }}>Business Setup</span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They want to learn from you:</div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    <span style={{ background: `var(--accent-alpha, rgba(16, 185, 129, 0.15))`, color: 'var(--accent)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(16, 185, 129, 0.3)` }}>React/Next.js</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <Link to={`/swaps`} state={{ targetUser: { _id: 'demo2', name: 'Sarah Lee' } }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent)', color: 'white' }}>
                                    <RefreshCw size={16} /> Request Pass
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Real Matches */}
                {matches.map(match => (
                    <motion.div key={match._id} variants={itemVariants} className="glass-panel" style={{ flex: '1 1 320px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between align-center mb-3">
                            <div className="flex align-center gap-2">
                                <div style={{ position: 'relative' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: `var(--primary-alpha, rgba(249, 115, 22, 0.2))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{match.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    {onlineUsers.includes(match._id) && (
                                        <div title="Online Now" style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10B981', border: '2px solid var(--bg-card)', borderRadius: '50%' }}></div>
                                    )}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {match.name}
                                        {match.isVerifiedMentor && (
                                            <span title="Verified Mentor" style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>⭐ Mentor</span>
                                        )}
                                    </h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {match.department} •
                                        <span style={{ color: 'var(--warning)', marginLeft: '4px' }}>★ {match.averageRating ? match.averageRating : 'New'}</span>
                                        {match.totalReviews > 0 ? ` (${match.totalReviews} reviews)` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They offer to teach you:</div>
                            <div className="flex gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
                                {(!match.skillsOffered || match.skillsOffered.length === 0) && (
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>Not specified</span>
                                )}
                                {(match.skillsOffered || []).map((skill, idx) => (
                                    <span key={idx} style={{ background: `var(--primary-alpha, rgba(249, 115, 22, 0.15))`, color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(249, 115, 22, 0.3)` }}>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>

                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>They want to learn from you:</div>
                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                {(!match.skillsWanted || match.skillsWanted.length === 0) && (
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>Not specified</span>
                                )}
                                {(match.skillsWanted || []).map((skill, idx) => (
                                    <span key={idx} style={{ background: `var(--accent-alpha, rgba(16, 185, 129, 0.15))`, color: 'var(--accent)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid rgba(16, 185, 129, 0.3)` }}>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => { setRateTarget(match); setShowRateModal(true); }} className="btn" style={{ padding: '0.5rem 0.5rem', background: 'var(--warning)', color: 'white' }} title="Rate this user">
                                ⭐
                            </button>
                            <Link to={`/chat`} state={{ targetUser: match }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary)', color: 'white' }}>
                                <MessageSquare size={16} /> Chat
                            </Link>
                            <Link to={`/swaps`} state={{ targetUser: match }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent)', color: 'white' }}>
                                <RefreshCw size={16} /> Request
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* End Real Matches */}

            {showRateModal && rateTarget && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setShowRateModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        <h2 className="mb-2 text-center" style={{ color: 'var(--warning)' }}>Rate {rateTarget.name}</h2>
                        <form onSubmit={handleRateSubmit} className="flex flex-col">
                            <label className="mb-1">Score out of 5 Stars:</label>
                            <select value={userRating} onChange={e => setUserRating(e.target.value)} required className="mb-3" style={{ padding: '10px' }}>
                                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                <option value="4">⭐⭐⭐⭐ Very Good</option>
                                <option value="3">⭐⭐⭐ Good</option>
                                <option value="2">⭐⭐ Fair</option>
                                <option value="1">⭐ Poor</option>
                            </select>
                            <label className="mb-1">Written Feedback (Optional):</label>
                            <textarea value={userFeedback} onChange={e => setUserFeedback(e.target.value)} rows="3" placeholder="How was your interaction?" className="mb-3" style={{ padding: '10px' }}></textarea>
                            <button type="submit" className="btn w-100" style={{ background: 'var(--warning)', color: 'white' }}>Submit Rating</button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Matches;

