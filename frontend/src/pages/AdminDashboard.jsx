import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ users: 0, sessions: 0, resources: 0, swaps: 0 });
    const [users, setUsers] = useState([]);
    const [pendingMentors, setPendingMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const statsRes = await axios.get('/api/admin/stats', config);
            setStats(statsRes.data);

            const usersRes = await axios.get('/api/admin/users', config);
            setUsers(usersRes.data);

            const mentorRes = await axios.get('/api/mentors/admin', config);
            setPendingMentors(mentorRes.data);

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`/api/admin/users/${id}`, config);
                setUsers(users.filter(u => u._id !== id));
                setStats({ ...stats, users: stats.users - 1 });
            } catch (error) {
                alert(error.response?.data?.message || "Failed to delete user");
            }
        }
    };

    const handleMentorUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/mentors/${id}`, { status }, config);
            setPendingMentors(pendingMentors.filter(m => m._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update mentor status");
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    if (loading) return <div className="text-center mt-4">Loading Admin Dashboard...</div>;

    return (
        <div className="animate-fade-in">
            <h1 className="mb-4 text-center" style={{ color: 'var(--accent)' }}>Admin Dashboard</h1>

            {/* Stats Row */}
            <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
                <div className="glass-panel text-center" style={{ flex: '1 1 200px', borderTop: '4px solid var(--primary)' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.users}</h2>
                    <p className="text-secondary">Total Users</p>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 200px', borderTop: '4px solid var(--success)' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.swaps}</h2>
                    <p className="text-secondary">Swap Requests</p>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 200px', borderTop: '4px solid var(--secondary)' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.sessions}</h2>
                    <p className="text-secondary">Sessions</p>
                </div>
                <div className="glass-panel text-center" style={{ flex: '1 1 200px', borderTop: '4px solid var(--accent)' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{stats.resources}</h2>
                    <p className="text-secondary">Resources Hosted</p>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-panel">
                <h3 className="mb-3">Manage Users</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Email</th>
                                <th style={{ padding: '10px' }}>Department</th>
                                <th style={{ padding: '10px' }}>Role</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '10px' }}>{u.name}</td>
                                    <td style={{ padding: '10px', color: 'var(--secondary)' }}>{u.email}</td>
                                    <td style={{ padding: '10px' }}>{u.department}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`} style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem', color: '#fff' }}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {u._id !== user._id && (
                                            <button
                                                className="btn"
                                                onClick={() => handleDeleteUser(u._id)}
                                                style={{ padding: '4px 10px', fontSize: '0.8rem', background: 'rgba(255, 123, 114, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mentor Approvals */}
            <div className="glass-panel mt-4">
                <h3 className="mb-3">Pending Mentor Credentials</h3>
                {pendingMentors.length === 0 ? (
                    <p className="text-secondary">No pending mentor requests.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '10px' }}>User / Dept</th>
                                    <th style={{ padding: '10px' }}>Skill & Level</th>
                                    <th style={{ padding: '10px' }}>Proof File</th>
                                    <th style={{ padding: '10px' }}>Description</th>
                                    <th style={{ padding: '10px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingMentors.map(m => (
                                    <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '10px' }}>
                                            <strong>{m.user?.name}</strong><br />
                                            <small className="text-secondary">{m.user?.department}</small>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ color: 'var(--primary)' }}>{m.skillName}</span><br />
                                            <small>{m.experienceLevel} ({m.yearsOfExperience} yrs)</small>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <a href={`${m.certificateFile}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                                                View Proof
                                            </a>
                                        </td>
                                        <td style={{ padding: '10px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.description}>
                                            {m.description}
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleMentorUpdate(m._id, 'Approved Mentor')} className="btn" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', border: '1px solid var(--success)', padding: '5px 10px' }}>Approve</button>
                                                <button onClick={() => handleMentorUpdate(m._id, 'Rejected')} className="btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '5px 10px' }}>Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

