import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';

const MentorDashboard = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [credentials, setCredentials] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [skillsOfferedText, setSkillsOfferedText] = useState(
        user.skillsOffered ? user.skillsOffered.map(s => s.name).join(', ') : ''
    );
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchCreds = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/mentors', config);
                setCredentials(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCreds();
    }, [user.token]);

    if (!user.isVerifiedMentor) {
        return <div className="text-center mt-5"><h3>You must be an approved mentor to view this dashboard.</h3></div>;
    }

    return (
        <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="mb-4 text-center">Mentor Dashboard</h1>
            <div className="glass-panel text-center mb-4 text-success" style={{ border: '1px solid var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <h2>⭐ Verified Mentor ⭐</h2>
                <p>Thank you for contributing to the CampusHub community!</p>
            </div>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {/* Left Side: Credentials */}
                <div style={{ flex: '2 1 400px' }}>
                    <h3>Your Approved Core Subjects</h3>
                    <div className="flex gap-3 mt-3" style={{ flexWrap: 'wrap' }}>
                        {credentials.filter(c => c.status === 'Approved Mentor').map(cred => (
                            <div key={cred._id} className="glass-panel" style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.05)' }}>
                                <h5 style={{ color: 'var(--primary)' }}>{cred.skillName}</h5>
                                <p className="text-secondary m-0" style={{ fontSize: '0.9rem' }}>Level: {cred.experienceLevel} ({cred.yearsOfExperience} yrs)</p>
                            </div>
                        ))}
                        {credentials.filter(c => c.status === 'Approved Mentor').length === 0 && (
                            <p className="text-secondary">No approved subjects yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Quick Edit Skills */}
                <div className="glass-panel" style={{ flex: '1 1 300px' }}>
                    <h3>Update Mentoring Skills</h3>
                    <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>You can update your current teaching skills tags here which show up in Discovery.</p>

                    {successMsg && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem' }}>{successMsg}</div>}

                    {editMode ? (
                        <div>
                            <input
                                type="text"
                                value={skillsOfferedText}
                                onChange={(e) => setSkillsOfferedText(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', marginBottom: '1rem' }}
                            />
                            <div className="flex gap-2">
                                <button onClick={() => {
                                    setEditMode(false);
                                    setSuccessMsg('Skills updated (Demo feature active)!');
                                }} className="btn btn-primary" style={{ padding: '0.5rem 1rem flex-1' }}>Save</button>
                                <button onClick={() => setEditMode(false)} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                                {skillsOfferedText || 'No specific skills added yet.'}
                            </div>
                            <button onClick={() => setEditMode(true)} className="btn btn-outline w-100 text-center">✏️ Edit Quick Skills</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MentorDashboard;

