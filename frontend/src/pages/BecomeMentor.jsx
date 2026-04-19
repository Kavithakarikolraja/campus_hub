import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, ShieldCheck } from 'lucide-react';

const BecomeMentor = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        skillName: '',
        experienceLevel: 'Beginner',
        yearsOfExperience: 1,
        portfolioLink: '',
        description: ''
    });
    const [certificateFile, setCertificateFile] = useState(null);
    const [status, setStatus] = useState(''); // 'submitting', 'success', 'error'
    const [message, setMessage] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setCertificateFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!certificateFile) {
            setMessage('Please upload a certificate or proof of experience.');
            setStatus('error');
            return;
        }

        setStatus('submitting');
        const submitData = new FormData();
        Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
        submitData.append('certificateFile', certificateFile);

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } };
            await axios.post('/api/mentors', submitData, config);
            setStatus('success');
            setMessage('Application submitted successfully! It is now pending admin review.');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to submit application.');
        }
    };

    if (user.isVerifiedMentor) {
        return (
            <div className="animate-fade-in text-center mt-5">
                <ShieldCheck size={80} color="var(--success)" className="mx-auto mb-3" />
                <h2>You are already a Verified Mentor!</h2>
                <p className="text-secondary">Head over to the Mentor Dashboard to manage your sessions.</p>
            </div>
        );
    }

    return (
        <motion.div className="animate-fade-in flex gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap' }}>
            {/* Form Section */}
            <div className="glass-panel" style={{ flex: '2 1 500px', padding: '2.5rem', borderTop: '4px solid var(--accent)' }}>
                <h2 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck color="var(--accent)" />
                    Become a Mentor
                </h2>
                <p className="text-secondary mb-4">Share your expertise with the CampusHub community. Submit your credentials below for verification.</p>

                {status === 'success' ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center" style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid var(--success)' }}>
                        <CheckCircle size={50} color="var(--success)" className="mx-auto mb-3" />
                        <h3 style={{ color: 'var(--success)' }}>{message}</h3>
                        <p className="text-secondary mt-2">We will review your application shortly.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {status === 'error' && <div style={{ color: 'var(--danger)', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{message}</div>}

                        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label className="mb-1 block">Full Name</label>
                                <input type="text" value={user.name} disabled style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }} className="w-100" />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label className="mb-1 block">Department</label>
                                <input type="text" value={user.department} disabled style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }} className="w-100" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block">Skill Name (What do you want to teach?)</label>
                            <input type="text" name="skillName" required value={formData.skillName} onChange={handleChange} placeholder="e.g., React.js, Public Speaking" className="w-100" />
                        </div>

                        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label className="mb-1 block">Experience Level</label>
                                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-100" style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <option value="Beginner" style={{ color: 'black' }}>Beginner</option>
                                    <option value="Intermediate" style={{ color: 'black' }}>Intermediate</option>
                                    <option value="Advanced" style={{ color: 'black' }}>Advanced</option>
                                    <option value="Expert" style={{ color: 'black' }}>Expert</option>
                                </select>
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label className="mb-1 block">Years of Experience</label>
                                <input type="number" name="yearsOfExperience" required min="1" value={formData.yearsOfExperience} onChange={handleChange} className="w-100" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block">Portfolio / GitHub / LinkedIn (Optional)</label>
                            <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} placeholder="https://..." className="w-100" />
                        </div>

                        <div>
                            <label className="mb-1 block">Description of Expertise</label>
                            <textarea name="description" required value={formData.description} onChange={handleChange} placeholder="Briefly describe your experience and what you can teach..." rows="3" className="w-100" style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}></textarea>
                        </div>

                        <div>
                            <label className="mb-2 block">Upload Credentials (Certificate / Proof)</label>
                            <div
                                style={{
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                    padding: '2rem',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                            >
                                <input type="file" required onChange={handleFileChange} accept=".pdf,image/*" style={{ display: 'none' }} id="certificateFile" />
                                <label htmlFor="certificateFile" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Upload size={40} color="var(--accent)" className="mb-2" />
                                    <p className="m-0" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        {certificateFile ? certificateFile.name : 'Click to Upload Proof'}
                                    </p>
                                    <p className="text-secondary" style={{ fontSize: '0.9rem' }}>PDF or Images highly recommended</p>
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="btn mt-3" style={{ background: 'var(--accent)', color: 'white', padding: '15px' }} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Submitting Application...' : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>

            {/* Demo Candidates Section */}
            <div className="glass-panel" style={{ flex: '1 1 350px', padding: '2.5rem', borderTop: '4px solid var(--primary)', height: 'fit-content' }}>
                <h3 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✨ Demo Candidates</h3>
                <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>Examples of approved mentors leading our platform's skill modules.</p>

                <div className="flex flex-col gap-3">
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex align-center gap-3 mb-2">
                            <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>JD</div>
                            <div>
                                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>John Doe <span style={{ fontSize: '0.7rem', background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>⭐ Verified</span></div>
                                <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Computer Science</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Specializes in React.js and System Design under the <strong style={{ color: 'var(--primary)' }}>Technical</strong> module. Taught 50+ students.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex align-center gap-3 mb-2">
                            <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SA</div>
                            <div>
                                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>Sarah Allen <span style={{ fontSize: '0.7rem', background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>⭐ Verified</span></div>
                                <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Business Admin</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Public Speaking and Negotiation pro for the <strong style={{ color: 'var(--secondary)' }}>Communication</strong> module. Master at interview prep.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex align-center gap-3 mb-2">
                            <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'black' }}>ML</div>
                            <div>
                                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>Mike Lee <span style={{ fontSize: '0.7rem', background: 'var(--success)', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>⭐ Verified</span></div>
                                <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Information Tech</div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong style={{ color: 'var(--warning)' }}>Aptitude</strong> and Logical Reasoning expert. Proven strategies to secure 95%+ in placements.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BecomeMentor;

