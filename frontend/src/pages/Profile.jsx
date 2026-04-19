import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: user.name || '',
        department: user.department || '',
        githubUsername: user.githubUsername || '',
        linkedinUrl: user.linkedinUrl || '',
    });

    const [skillsOffered, setSkillsOffered] = useState(user.skillsOffered || []);
    const [skillsWanted, setSkillsWanted] = useState(user.skillsWanted || []);

    // For adding new skills directly on profile
    const [newOffered, setNewOffered] = useState({ name: '', category: 'Technical' });
    const [newWanted, setNewWanted] = useState({ name: '', category: 'Technical' });

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const payload = {
                ...formData,
                skillsOffered: JSON.stringify(skillsOffered),
                skillsWanted: JSON.stringify(skillsWanted)
            };
            const { data } = await axios.put('/api/users/profile', payload, config);
            updateUser(data);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div className="animate-fade-in flex flex-col align-center">
            <div className="glass-panel w-100" style={{ maxWidth: '800px', width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>{user.name}</h1>
                    <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{user.department} Department</p>
                    <div className="flex gap-2 mb-2">
                        {user.role === 'admin' && (
                            <span style={{ background: 'rgba(255, 123, 114, 0.2)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                ADMIN
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-panel w-100" style={{ maxWidth: '800px', width: '100%' }}>
                <h2 className="mb-3">Update Profile Details</h2>

                {message && (
                    <div style={{ padding: '1rem', background: 'rgba(88, 166, 255, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '8px', marginBottom: '1rem' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 300px' }}>
                            <label className="mb-1 text-secondary">Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div style={{ flex: '1 1 300px' }}>
                            <label className="mb-1 text-secondary">Department</label>
                            <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                        </div>
                    </div>

                    <div className="mt-3">
                        <h4 className="mb-2">Skills Offered</h4>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {skillsOffered.map((s, idx) => (
                                <span key={idx} style={{ background: 'rgba(88, 166, 255, 0.1)', padding: '4px 10px', borderRadius: '15px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {s.name} <small className="text-secondary">({s.category})</small>
                                    <button type="button" onClick={() => setSkillsOffered(skillsOffered.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0 5px' }}>&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Add skill to offer..." value={newOffered.name} onChange={e => setNewOffered({ ...newOffered, name: e.target.value })} style={{ flex: 1 }} />
                            <select value={newOffered.category} onChange={e => setNewOffered({ ...newOffered, category: e.target.value })}>
                                <option>Technical</option><option>Communication</option><option>Aptitude</option><option>Design</option><option>Language</option>
                            </select>
                            <button type="button" className="btn btn-outline" onClick={() => { if (newOffered.name) { setSkillsOffered([...skillsOffered, newOffered]); setNewOffered({ name: '', category: 'Technical' }); } }}>Add</button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h4 className="mb-2">Skills Wanted</h4>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {skillsWanted.map((s, idx) => (
                                <span key={idx} style={{ background: 'rgba(138, 43, 226, 0.1)', padding: '4px 10px', borderRadius: '15px', border: '1px solid var(--secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    {s.name} <small className="text-secondary">({s.category})</small>
                                    <button type="button" onClick={() => setSkillsWanted(skillsWanted.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0 5px' }}>&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Add skill you want..." value={newWanted.name} onChange={e => setNewWanted({ ...newWanted, name: e.target.value })} style={{ flex: 1 }} />
                            <select value={newWanted.category} onChange={e => setNewWanted({ ...newWanted, category: e.target.value })}>
                                <option>Technical</option><option>Communication</option><option>Aptitude</option><option>Design</option><option>Language</option>
                            </select>
                            <button type="button" className="btn btn-outline" onClick={() => { if (newWanted.name) { setSkillsWanted([...skillsWanted, newWanted]); setNewWanted({ name: '', category: 'Technical' }); } }}>Add</button>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 300px' }}>
                            <label className="mb-1 text-secondary">GitHub Username</label>
                            <input type="text" placeholder="octocat" value={formData.githubUsername} onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })} />
                        </div>
                        <div style={{ flex: '1 1 300px' }}>
                            <label className="mb-1 text-secondary">LinkedIn Profile URL</label>
                            <input type="text" placeholder="https://linkedin.com/in/username" value={formData.linkedinUrl} onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                </form>

                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <h3>Social Links</h3>
                    <div className="flex gap-2 mt-2">
                        {user.githubUsername ? (
                            <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                💻 GitHub Profile
                            </a>
                        ) : (
                            <p className="text-secondary">No GitHub linked yet.</p>
                        )}

                        {user.linkedinUrl ? (
                            <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0a66c2', borderColor: '#0a66c2' }}>
                                👔 LinkedIn Profile
                            </a>
                        ) : (
                            <p className="text-secondary">No LinkedIn linked yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

