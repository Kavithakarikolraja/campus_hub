import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw, User as UserIcon } from 'lucide-react';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { user, onlineUsers } = useContext(AuthContext);
    const [peers, setPeers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPeers = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                let fetchedPeers = [];
                if (categoryName === 'project-collab') {
                    const { data } = await axios.get(`/api/users`, config);
                    fetchedPeers = data.filter(u => u._id !== user._id);
                } else {
                    const { data } = await axios.get(`/api/users/search?query=${categoryName}`, config);
                    fetchedPeers = data;
                }
                // Demo Mentors logic: Inject 2 specific demo mentors for whatever category we are browsing
                const demoMentors = [
                    {
                        _id: `demo-${categoryName}-1`,
                        name: "Alex Pro (Demo)",
                        department: "Senior Mentor",
                        isVerifiedMentor: true,
                        skillsOffered: [{ name: "Advanced Mastery", category: categoryName }]
                    },
                    {
                        _id: `demo-${categoryName}-2`,
                        name: "Sam Expert (Demo)",
                        department: "Professional Coach",
                        isVerifiedMentor: true,
                        skillsOffered: [{ name: "Beginner Principles", category: categoryName }]
                    }
                ];

                setPeers([...demoMentors, ...fetchedPeers]);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch peers", error);
                setLoading(false);
            }
        };
        fetchPeers();
    }, [categoryName, user.token]);

    const categoryColors = {
        technical: 'var(--primary)',
        communication: 'var(--secondary)',
        aptitude: 'var(--accent)',
        design: 'var(--success)',
        language: 'var(--warning)'
    };

    const activeColor = categoryColors[categoryName] || 'var(--primary)';
    const isProjectCollab = categoryName === 'project-collab';

    if (loading) return <div className="text-center mt-4">Loading Peers...</div>;

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: 'spring' } } };

    const categoryMentorsCount = peers.filter(p => p.isVerifiedMentor).length;

    // Summary calculations
    const stats = {
        offered: peers.reduce((acc, peer) => acc + (peer.skillsOffered?.length || 0), 0) + 5,
        needed: peers.reduce((acc, peer) => acc + (peer.skillsWanted?.length || 0), 0) + 3,
        swaps: Math.floor(peers.length * 1.5) + 2,
        sessions: Math.floor(peers.length * 0.8) + 1
    };

    return (
        <motion.div className="animate-fade-in" initial="hidden" animate="show" variants={containerVariants}>
            <div className="glass-panel text-center mb-4" style={{ borderTop: `4px solid ${activeColor}` }}>
                <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize', color: activeColor }}>
                    {categoryName} Skills Hub
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem' }}>
                    Discover peers who offer {categoryName} skills. Connect, chat, or request a swap!
                </p>
            </div>

            {/* Summary Cards */}
            <div className="flex gap-3 mb-4" style={{ flexWrap: 'wrap' }}>
                <div className="glass-panel text-center" style={{ flex: '1 1 150px', borderTop: `3px solid ${activeColor}` }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>👨‍💻</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.offered}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{isProjectCollab ? 'Project Skills Available' : 'Skills Offered'}</div>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 150px', borderTop: `3px solid ${activeColor}` }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📚</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.needed}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{isProjectCollab ? 'Project Roles Needed' : 'Skills Requested'}</div>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 150px', borderTop: `3px solid ${activeColor}` }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🤝</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.swaps}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{isProjectCollab ? 'Active Collaborations' : 'Active Skill Swaps'}</div>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 150px', borderTop: `3px solid ${activeColor}` }}>
                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🧠</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.sessions}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{isProjectCollab ? 'Teams Formed' : 'Sessions Today'}</div>
                </div>
            </div>

            {isProjectCollab ? (
                <div className="glass-panel text-center mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeColor}55` }}>
                    <h3 style={{ margin: '0 0 10px 0', color: activeColor }}>Available Collaborators Overview</h3>
                    <p className="text-secondary" style={{ marginBottom: '15px' }}>
                        There are currently <strong>{peers.length}</strong> peers actively seeking project collaboration. Based on your requirements, connect and manage your team below!
                    </p>
                </div>
            ) : (
                <div className="glass-panel text-center mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeColor}55` }}>
                    <h3 style={{ margin: '0 0 10px 0', color: activeColor }}>Mentorship Availability Overview</h3>
                    <p className="text-secondary" style={{ marginBottom: '15px' }}>
                        There are currently <strong>{categoryMentorsCount}</strong> verified premium mentors and <strong>{peers.length}</strong> peers available in the <strong>{categoryName}</strong> hub.
                    </p>
                </div>
            )}

            {peers.length === 0 ? (
                <div className="text-center text-secondary">No peers currently offering skills in this category.</div>
            ) : (
                <motion.div className="flex gap-4" style={{ flexWrap: 'wrap' }} variants={containerVariants}>
                    {peers.map((peer) => (
                        <motion.div key={peer._id} variants={itemVariants} className="glass-panel" style={{ flex: '1 1 320px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div className="flex justify-between align-center mb-3">
                                <div className="flex align-center gap-2">
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${activeColor}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeColor }}>
                                            <UserIcon size={20} />
                                        </div>
                                        {onlineUsers.includes(peer._id) && (
                                            <div title="Online Now" style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10B981', border: '2px solid var(--bg-card)', borderRadius: '50%' }}></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {peer.name}
                                            {peer.isVerifiedMentor && (
                                                <span title="Verified Mentor" style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: '10px' }}>⭐</span>
                                            )}
                                        </h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{peer.department}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Skills Offered:</div>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '10px' }}>
                                    {(peer.skillsOffered || []).filter(s => isProjectCollab || (s.category && s.category.toLowerCase() === categoryName.toLowerCase())).map((skill, idx) => (
                                        <span key={idx} style={{ background: `${activeColor}22`, color: activeColor, padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', border: `1px solid ${activeColor}44` }}>
                                            {skill.name} {isProjectCollab && <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>({skill.category})</span>}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <Link to={`/swaps`} state={{ targetUser: peer }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--primary)', color: 'white' }}>
                                    <RefreshCw size={16} /> Request Session
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default CategoryPage;

