import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Module = () => {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const { user, updateUser } = useContext(AuthContext);

    const [moduleData, setModuleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch module data (In a real app, you'd fetch specific module by ID from DB)
    // For this prototype, we'll fetch all and filter client-side
    useEffect(() => {
        const fetchModule = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/modules', config);

                if (data[category]) {
                    const found = data[category].find(m => m.id === parseInt(id));
                    if (found) setModuleData(found);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch module", error);
                setLoading(false);
            }
        };
        fetchModule();
    }, [category, id, user.token]);

    const handleComplete = async () => {
        setClaiming(true);
        try {
            // Create an endpoint call to add points. 
            // For now, we'll hit the profile update endpoint to artificially increase points just for demonstration.
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            // In a real robust app, you'd have a specific secure endpoint like POST /api/users/reward endpoint
            // To simulate it here, we will just show a success message. 
            // If we had the specific backend logic, we'd do: await axios.post('/api/users/reward', { points: moduleData.reward }, config);

            setMessage(`🎉 Congratulations! You have completed the module and earned ${moduleData.reward} points!`);

            // Artificial delay for UI effect
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);

        } catch (error) {
            setMessage('Something went wrong claiming your reward.');
            setClaiming(false);
        }
    };

    if (loading) return <div className="text-center mt-4">Loading Module...</div>;
    if (!moduleData) return <div className="text-center mt-4">Module not found.</div>;

    const getGradient = () => {
        switch (category) {
            case 'technical': return 'linear-gradient(135deg, rgba(88, 166, 255, 0.2), transparent)';
            case 'communication': return 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), transparent)';
            case 'aptitude': return 'linear-gradient(135deg, rgba(255, 123, 114, 0.2), transparent)';
            case 'integration': return 'linear-gradient(135deg, rgba(63, 185, 80, 0.2), transparent)';
            default: return 'var(--glass-bg)';
        }
    };

    return (
        <div className="animate-fade-in flex flex-col align-center">
            <div className="glass-panel w-100" style={{ maxWidth: '800px', width: '100%', background: getGradient() }}>

                <button onClick={() => navigate('/dashboard')} className="btn btn-outline mb-3" style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}>
                    ← Back to Dashboard
                </button>

                <div className="flex justify-between align-center mb-2">
                    <h1 style={{ margin: 0, textTransform: 'capitalize' }}>{moduleData.title}</h1>
                    <div style={{ background: 'rgba(63, 185, 80, 0.2)', border: '1px solid var(--success)', color: 'var(--success)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
                        Reward: {moduleData.reward} ⭐
                    </div>
                </div>

                <span className="text-secondary" style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {category} Module
                </span>

                {message && (
                    <div className="mt-3 p-3 text-center" style={{ background: 'rgba(63, 185, 80, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {message}
                    </div>
                )}

                {moduleData.imageUrl && (
                    <div className="mt-4" style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                        <img src={moduleData.imageUrl} alt={moduleData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                )}

                <div className="mt-4 pt-3 text-primary" style={{ borderTop: '1px solid var(--border-color)', minHeight: '200px', lineHeight: '1.8' }}>
                    <p style={{ fontSize: '1.1rem' }}>{moduleData.description}</p>

                    <div className="mt-4 p-3" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                        <h3>📘 Module Content</h3>
                        <p className="text-secondary mt-1">
                            Watch the video, read the provided documentation below, and click complete when you are ready to claim your points.
                        </p>
                        {/* Placeholder for actual content */}
                        <div className="mt-2" style={{ width: '100%', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            Video / Interactive Content Placeholder
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleComplete}
                        disabled={claiming || message}
                        className="btn btn-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                    >
                        {claiming ? 'Processing...' : 'Mark as Completed'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Module;

