import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: 'Computer Science',
        skillOfferedName: '',
        skillOfferedCat: 'Technical',
        skillWantedName: '',
        skillWantedCat: 'Technical'
    });
    const [userRole, setUserRole] = useState('both');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        const offered = (userRole === 'teacher' || userRole === 'both') && formData.skillOfferedName ? [{ name: formData.skillOfferedName, category: formData.skillOfferedCat }] : [];
        const wanted = (userRole === 'learner' || userRole === 'both') && formData.skillWantedName ? [{ name: formData.skillWantedName, category: formData.skillWantedCat }] : [];

        const res = await register(formData.name, formData.email, formData.password, formData.department, offered, wanted);
        if (!res.success) {
            setError(res.message);
        } else {
            navigate('/dashboard');
        }
    };

    const inputStyle = { width: '100%', padding: '0.7rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', marginBottom: '0.5rem' };
    const labelStyle = { display: 'block', marginBottom: '0.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)' };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflowX: 'hidden', padding: '2rem', overflowY: 'auto' }}>

            <motion.div
                style={{ position: 'absolute', top: '-5%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
                className="glass-panel"
                style={{ width: '100%', maxWidth: '650px', position: 'relative', zIndex: 10, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', margin: 'auto' }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>Registration</h2>
                    <p className="text-secondary" style={{ marginTop: '0.3rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        Join the Campus<span style={{ color: 'var(--primary)' }}>Hub</span> network and get <strong style={{ color: 'var(--success)' }}>10 pts</strong> instantly.
                    </p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                    <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={labelStyle}>Full Name</label>
                            <input type="text" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                        </div>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={labelStyle}>Email Address</label>
                            <input type="email" placeholder="student@college.edu" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Department</label>
                        <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} style={inputStyle} required>
                            <option value="" disabled>Select your department</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Business/Management">Business/Management</option>
                            <option value="Arts/Design">Arts/Design</option>
                        </select>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--primary)' }}>What brings you to CampusHub?</h4>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <input type="radio" checked={userRole === 'learner'} onChange={() => setUserRole('learner')} /> I'm a Learner
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <input type="radio" checked={userRole === 'teacher'} onChange={() => setUserRole('teacher')} /> I'm a Teacher
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                <input type="radio" checked={userRole === 'both'} onChange={() => setUserRole('both')} /> Swap Skills (Both)
                            </label>
                        </div>

                        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                            {(userRole === 'teacher' || userRole === 'both') && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>What do you want to teach?</label>
                                    <input type="text" placeholder="e.g. React" value={formData.skillOfferedName} onChange={e => setFormData({ ...formData, skillOfferedName: e.target.value })} style={inputStyle} />
                                    <select value={formData.skillOfferedCat} onChange={e => setFormData({ ...formData, skillOfferedCat: e.target.value })} style={inputStyle}>
                                        <option value="Technical">Technical</option>
                                        <option value="Communication">Communication</option>
                                        <option value="Aptitude">Aptitude</option>
                                        <option value="Design">Design</option>
                                        <option value="Language">Language</option>
                                    </select>
                                </div>
                            )}
                            {(userRole === 'learner' || userRole === 'both') && (
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={labelStyle}>What do you want to learn?</label>
                                    <input type="text" placeholder="e.g. Graphic Design" value={formData.skillWantedName} onChange={e => setFormData({ ...formData, skillWantedName: e.target.value })} style={inputStyle} />
                                    <select value={formData.skillWantedCat} onChange={e => setFormData({ ...formData, skillWantedCat: e.target.value })} style={inputStyle}>
                                        <option value="Technical">Technical</option>
                                        <option value="Communication">Communication</option>
                                        <option value="Aptitude">Aptitude</option>
                                        <option value="Design">Design</option>
                                        <option value="Language">Language</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={labelStyle}>Password</label>
                            <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                        </div>
                        <div style={{ flex: '1 1 250px' }}>
                            <label style={labelStyle}>Confirm Password</label>
                            <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'} />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        style={{ padding: '0.9rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Create Account
                    </motion.button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

