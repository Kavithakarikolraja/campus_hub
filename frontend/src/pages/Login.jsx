import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(formData.email, formData.password);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2rem' }}>

            {/* Animated Background Gradients & Particles */}
            <motion.div
                style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
                className="glass-panel"
                style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10, padding: '3rem 2.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Branding Header */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}
                    >
                        <Code2 size={28} color="white" />
                    </motion.div>
                    <h1 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 700 }}>
                        Welcome to Campus<span style={{ color: 'var(--primary)', fontWeight: 300 }}>Hub</span>
                    </h1>
                    <p className="text-secondary" style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.95rem' }}>Learn, Share, and Grow Together.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.9rem', textAlign: 'center' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="student@college.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', marginBottom: 0 }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.2)' }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', marginBottom: 0 }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.2)' }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ margin: 0, cursor: 'pointer', width: 'auto' }}
                            />
                            Remember me
                        </label>
                        <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); alert("Forgot Password Flow (Mock)") }}>Forgot password?</a>
                    </div>

                    <motion.button
                        type="submit"
                        style={{ padding: '0.9rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem', position: 'relative', overflow: 'hidden' }}
                        whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign In
                        <motion.div
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                        />
                    </motion.button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Create one now
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

