import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCollab = () => {
    const { user, onlineUsers } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', requiredRoles: '' });

    const fetchProjects = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/projects', config);
            setProjects(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch projects');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user.token]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const rolesArray = formData.requiredRoles.split(',').map(role => role.trim()).filter(Boolean);
            await axios.post('/api/projects', {
                title: formData.title,
                description: formData.description,
                requiredRoles: rolesArray
            }, config);
            setFormData({ title: '', description: '', requiredRoles: '' });
            setShowForm(false);
            fetchProjects();
        } catch (error) {
            console.error('Failed to create project');
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`/api/projects/${projectId}`, config);
            setProjects(projects.filter(p => p._id !== projectId));
        } catch (error) {
            console.error('Failed to delete project');
        }
    };

    const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1, transition: { type: 'spring' } } };

    if (loading) return <div className="text-center mt-4">Loading Projects...</div>;

    return (
        <motion.div className="animate-fade-in" initial="hidden" animate="show" variants={containerVariants}>
            <div className="glass-panel text-center mb-4" style={{ borderTop: `4px solid var(--success)` }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Users size={36} /> Project Collaboration
                </h1>
                <p className="text-secondary" style={{ fontSize: '1.2rem' }}>
                    Post a project you're building to recruit members with specific skills, or browse projects needing your skills!
                </p>
                <button onClick={() => setShowForm(!showForm)} className="btn mt-3" style={{ background: 'var(--success)', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle size={18} /> {showForm ? 'Cancel Creation' : 'Create New Project Request'}
                </button>
            </div>

            {showForm && (
                <motion.div variants={itemVariants} className="glass-panel mb-4">
                    <h3 className="mb-3" style={{ color: 'var(--success)' }}>Post a New Project</h3>
                    <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
                        <div>
                            <label className="text-secondary mb-1">Project Title</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Next.js AI Chatbot" style={{ width: '100%' }} />
                        </div>
                        <div>
                            <label className="text-secondary mb-1">Project Description & Goal</label>
                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe what you are building and what the goal is..." rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}></textarea>
                        </div>
                        <div>
                            <label className="text-secondary mb-1">Required Roles / Demands (Comma Separated)</label>
                            <input type="text" required value={formData.requiredRoles} onChange={e => setFormData({ ...formData, requiredRoles: e.target.value })} placeholder="e.g. Frontend Developer, UI Designer, Python Expert" style={{ width: '100%' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', background: 'var(--success)', border: 'none' }}>
                            Post Project
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="grid gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {projects.length === 0 ? (
                    <div className="text-secondary w-100 text-center mt-4" style={{ gridColumn: '1 / -1' }}>No projects available right now. Be the first to post!</div>
                ) : (
                    projects.map(project => (
                        <motion.div key={project._id} variants={itemVariants} className="glass-panel flex flex-col justify-between" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                            <div>
                                <div className="flex justify-between align-start mb-2">
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                                    {(user._id === project.userId?._id || user.role === 'admin') && (
                                        <button onClick={() => handleDelete(project._id)} title="Delete Project" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="text-secondary mb-3" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Posted by: <strong>{project.userId?.name || 'Unknown User'}</strong>
                                    {project.userId && onlineUsers.includes(project.userId._id) && (
                                        <div title="Online Now" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></div>
                                    )}
                                    {project.userId?.department && `(${project.userId.department})`}
                                </div>
                                <p className="mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    {project.description}
                                </p>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 'bold' }}>Required Demands/Roles:</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {project.requiredRoles.map((role, idx) => (
                                            <span key={idx} style={{ background: 'var(--success-alpha, rgba(16, 185, 129, 0.15))', color: 'var(--success)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {user._id !== project.userId?._id ? (
                                <Link to={`/chat`} state={{ targetUser: project.userId, projectId: project._id }} onClick={() => { localStorage.setItem('recentProjectCollab', project.title) }} className="btn w-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--success)', color: 'white', border: 'none' }}>
                                    <MessageSquare size={16} /> Collaborate via Chat
                                </Link>
                            ) : (
                                <div className="text-center text-secondary" style={{ fontSize: '0.9rem', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    This is your project request.
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default ProjectCollab;

