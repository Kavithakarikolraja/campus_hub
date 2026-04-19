import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const SwapRequests = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Core state
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [loading, setLoading] = useState(true);

    // Send Request Modal State
    const [showSendModal, setShowSendModal] = useState(false);
    const [targetUser, setTargetUser] = useState(null);
    const [requestMessage, setRequestMessage] = useState('');

    // Schedule Modal State
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [schedulePartner, setSchedulePartner] = useState(null);
    const [scheduleData, setScheduleData] = useState({ date: '', time: '', duration: 15, link: '' });

    const fetchRequests = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/swaps', config);
            setReceived(data.received);
            setSent(data.sent);
        } catch (error) {
            console.error("Failed to fetch swap requests", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();

        const interval = setInterval(() => {
            fetchRequests();
        }, 5000);

        // Handle incoming targetUser from Matches/Category pages
        if (location.state?.targetUser) {
            setTargetUser(location.state.targetUser);
            setShowSendModal(true);
            setRequestMessage(`Hi ${location.state.targetUser.name.split(' ')[0]}, I'd love to exchange skills with you!`);
            window.history.replaceState({}, document.title);
        }

        return () => clearInterval(interval);
    }, [user.token, location.state]);

    const handleAction = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/swaps/${id}`, { status }, config);
            fetchRequests();
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const handleSendRequest = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/swaps', {
                providerId: targetUser._id,
                message: requestMessage
            }, config);
            alert("Swap request sent successfully!");
            setShowSendModal(false);
            setTargetUser(null);
            fetchRequests();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send request.");
        }
    };

    const handleScheduleSession = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/sessions', {
                providerId: schedulePartner._id,
                date: scheduleData.date,
                time: scheduleData.time,
                duration: scheduleData.duration,
                link: scheduleData.link
            }, config);
            setShowScheduleModal(false);
            alert("Session legally scheduled! Check your 'My Sessions' tab to view details.");
            setScheduleData({ date: '', time: '', duration: 15, link: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to schedule session!");
        }
    };

    if (loading) return <div className="text-center mt-4">Loading requests...</div>;

    return (
        <div className="animate-fade-in">
            <h1 className="text-center mb-4">Skill Swap Requests</h1>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {/* Received Requests */}
                <div style={{ flex: '1 1 400px' }}>
                    <h2>Received ({received.length})</h2>
                    {received.length === 0 && <p className="text-secondary">No real incoming requests. (Showing Demo)</p>}

                    {received.length === 0 && (
                        <div className="glass-panel mb-3" style={{ opacity: 0.8 }}>
                            <div className="flex justify-between align-center mb-2">
                                <h3>Alex Johnson (Demo)</h3>
                                <span className={`badge bg-warning`} style={{ background: 'var(--warning)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}>
                                    PENDING
                                </span>
                            </div>
                            <p className="text-secondary mb-2">Mechanical Engineering</p>
                            <p className="mb-2" style={{ fontStyle: 'italic' }}>"Hi, I noticed you teach React. I can teach you CAD modeling!"</p>

                            <div className="flex gap-2">
                                <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Accept</button>
                                <button className="btn btn-outline" style={{ flex: 1, padding: '0.5rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}>Reject</button>
                            </div>
                        </div>
                    )}

                    {received.map(req => (
                        <div key={req._id} className="glass-panel mb-3">
                            <div className="flex justify-between align-center mb-2">
                                <h3>{req.requester.name}</h3>
                                <span className={`badge ${req.status === 'pending' ? 'bg-warning' : req.status === 'accepted' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}>
                                    {req.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-secondary mb-2">{req.requester.department}</p>
                            {req.message && <p className="mb-2" style={{ fontStyle: 'italic' }}>"{req.message}"</p>}

                            <div className="flex gap-2">
                                {req.status === 'pending' && (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleAction(req._id, 'accepted')} style={{ flex: 1, padding: '0.5rem' }}>Accept</button>
                                        <button className="btn btn-outline" onClick={() => handleAction(req._id, 'rejected')} style={{ flex: 1, padding: '0.5rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}>Reject</button>
                                    </>
                                )}
                                {req.status === 'accepted' && (
                                    <div className="flex flex-col gap-2 w-100">
                                        <button onClick={() => { setSchedulePartner(req.requester); setShowScheduleModal(true); }} className="btn btn-outline w-100 text-center" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>
                                            📅 Schedule Session Now
                                        </button>
                                        <Link to="/chat" state={{ targetUser: req.requester }} className="btn btn-outline w-100 text-center" style={{ fontSize: '0.9rem' }}>Chat & coordinate</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sent Requests */}
                <div style={{ flex: '1 1 400px' }}>
                    <h2>Sent ({sent.length})</h2>
                    {sent.length === 0 && <p className="text-secondary">You haven't sent any requests. (Showing Demo)</p>}

                    {sent.length === 0 && (
                        <div className="glass-panel mb-3" style={{ opacity: 0.8 }}>
                            <div className="flex justify-between align-center mb-2">
                                <h3>Sarah Lee (Demo)</h3>
                                <span className={`badge bg-success`} style={{ background: 'var(--success)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}>
                                    ACCEPTED
                                </span>
                            </div>
                            <p className="text-secondary mb-2">Business/Management</p>
                            <p className="mb-2" style={{ fontStyle: 'italic' }}>"I'd love to learn negotiation skills from you!"</p>

                            <button className="btn w-100 text-center mt-2" style={{ display: 'block', background: 'var(--success)', color: 'white' }}>📅 Schedule Session Now</button>
                            <button className="btn btn-outline w-100 text-center mt-2" style={{ display: 'block' }}>Chat & coordinate</button>
                        </div>
                    )}

                    {sent.map(req => (
                        <div key={req._id} className="glass-panel mb-3">
                            <div className="flex justify-between align-center mb-2">
                                <h3>{req.provider.name}</h3>
                                <span className={`badge ${req.status === 'pending' ? 'bg-warning' : req.status === 'accepted' ? 'bg-success' : 'bg-danger'}`} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff' }}>
                                    {req.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-secondary mb-2">{req.provider.department}</p>
                            {req.message && <p className="mb-2" style={{ fontStyle: 'italic' }}>"{req.message}"</p>}

                            {req.status === 'accepted' && (
                                <div className="flex flex-col gap-2 w-100 mt-2">
                                    <button onClick={() => { setSchedulePartner(req.provider); setShowScheduleModal(true); }} className="btn w-100 text-center" style={{ background: 'var(--success)', color: 'white', border: 'none' }}>
                                        📅 Schedule Session Now
                                    </button>
                                    <Link to="/chat" state={{ targetUser: req.provider }} className="btn btn-outline w-100 text-center" style={{ fontSize: '0.9rem' }}>Chat & coordinate</Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Send Request Modal */}
            {showSendModal && targetUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                        <button onClick={() => setShowSendModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        <h2 className="mb-2 text-center" style={{ color: 'var(--primary)' }}>Request Skill Exchange</h2>
                        <p className="text-center text-secondary mb-3">Sending request to <strong>{targetUser.name}</strong></p>
                        <form onSubmit={handleSendRequest} className="flex flex-col">
                            <label className="mb-1">Include a message (what you want to learn & teach):</label>
                            <textarea required rows="4" value={requestMessage} onChange={e => setRequestMessage(e.target.value)} className="mb-3" style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}></textarea>
                            <button type="submit" className="btn btn-primary">Send Swap Request</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Schedule Session Modal */}
            {showScheduleModal && schedulePartner && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        <h2 className="mb-2 text-center" style={{ color: 'var(--success)' }}>Schedule Session</h2>
                        <p className="text-center text-secondary mb-3">With <strong>{schedulePartner.name}</strong></p>

                        <form onSubmit={handleScheduleSession} className="flex flex-col">
                            <label className="mb-1">Date</label>
                            <input type="date" required value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} className="mb-2" />

                            <label className="mb-1">Time</label>
                            <input type="time" required value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} className="mb-2" />

                            <label className="mb-1">Duration (minutes)</label>
                            <input type="number" required min="15" step="15" value={scheduleData.duration} onChange={e => setScheduleData({ ...scheduleData, duration: e.target.value })} className="mb-2" />

                            <label className="mb-1">Meeting Link (Zoom/Meet)</label>
                            <input type="url" placeholder="https://meet.google.com/..." required value={scheduleData.link} onChange={e => setScheduleData({ ...scheduleData, link: e.target.value })} className="mb-3" />

                            <button type="submit" className="btn w-100 text-center" style={{ background: 'var(--success)', color: 'white', border: 'none' }}>✔️ Confirm & Schedule</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SwapRequests;

