import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, ArrowRight } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        // Clear previous user session whenever reaching the Landing page
        logout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '2rem' }}>
            {/* Animated Background Gradients & Particles */}
            <motion.div
                style={{ position: 'absolute', top: '10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
                style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}
                animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main Content */}
            <motion.div
                style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)' }}
                >
                    <Code2 size={40} color="white" />
                </motion.div>

                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                    Connect. Share. <br />
                    <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Master Every Skill.
                    </span>
                </h1>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                    Join CampusHub to discover peers, swap real-world knowledge, and schedule mentorship sessions across your entire university network.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <motion.button
                            style={{ padding: '1rem 2rem', borderRadius: '12px', border: 'none', background: 'white', color: 'black', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(255, 255, 255, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Enter CampusHub
                            <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                                <ArrowRight size={20} />
                            </motion.div>
                        </motion.button>
                    </Link>
                </div>
            </motion.div>

            {/* Floating Badges */}
            <motion.div
                className="glass-panel"
                style={{ position: 'absolute', top: '20%', right: '15%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)' }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Skill Offered</div>
                    <div style={{ fontWeight: 'bold' }}>React JS</div>
                </div>
            </motion.div>

            <motion.div
                className="glass-panel"
                style={{ position: 'absolute', bottom: '25%', left: '15%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)' }}
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Skill Wanted</div>
                    <div style={{ fontWeight: 'bold' }}>UI Design</div>
                </div>
            </motion.div>
        </div>
    );
};

export default Landing;

