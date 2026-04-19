import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Sessions = () => {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/sessions', config);
            setSessions(data);
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [user.token]);

    const handleReviewSubmit = async (e, sessionId, revieweeId) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const feedback = e.target.feedback.value;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`/api/sessions/${sessionId}/review`, {
                rating, feedback, revieweeId
            }, config);
            alert('Review submitted successfully!');
            e.target.reset();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) return <div className="text-center mt-4">Loading sessions...</div>;

    const today = new Date();

    return (
        <div className="animate-fade-in">
            <h1 className="text-center mb-4">My Learning Sessions</h1>

            {sessions.length === 0 ? (
                <div className="text-center text-secondary mb-4">No sessions scheduled yet. Match with users and chat to schedule sessions! (Showing demo below)</div>
            ) : null}

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {sessions.length === 0 && (
                    <div className="glass-panel" style={{ flex: '1 1 300px', borderLeft: `5px solid var(--success)` }}>
                        <h3>Teaching Session (Demo)</h3>
                        <p className="text-secondary mb-2">Partner: <strong>Jane Smith</strong> (Design)</p>
                        <div className="mb-2">
                            <strong>Date:</strong> {new Date().toLocaleDateString()}<br />
                            <strong>Time:</strong> 18:00<br />
                            <strong>Duration:</strong> 45 mins
                        </div>
                        <div className="mb-3">
                            <strong>Meeting Link:</strong> <a href="#" style={{ color: 'var(--primary)' }}>https://meet.google.com/demo-link</a>
                        </div>
                    </div>
                )}
                {sessions.map(s => {
                    const isProvider = s.provider._id === user._id;
                    const partner = isProvider ? s.requester : s.provider;
                    const sessionDate = new Date(s.date);
                    const isPast = sessionDate < today;

                    return (
                        <div key={s._id} className="glass-panel" style={{ flex: '1 1 300px', borderLeft: `5px solid ${isPast ? 'var(--secondary)' : 'var(--success)'}` }}>
                            <h3>{isProvider ? 'Teaching' : 'Learning'} Session</h3>
                            <p className="text-secondary mb-2">Partner: <strong>{partner.name}</strong> ({partner.department})</p>
                            {s.project && (
                                <p className="mb-2" style={{ background: 'var(--success-alpha, rgba(16, 185, 129, 0.15))', color: 'var(--success)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.9rem', display: 'inline-block' }}>
                                    🎯 Project: <strong>{s.project.title}</strong>
                                </p>
                            )}

                            <div className="mb-2">
                                <strong>Date:</strong> {sessionDate.toLocaleDateString()}<br />
                                <strong>Time:</strong> {s.time}<br />
                                <strong>Duration:</strong> {s.duration} mins
                            </div>

                            {s.link && (
                                <div className="mb-3">
                                    <strong>Meeting Link:</strong> <a href={s.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Join Meeting</a>
                                </div>
                            )}

                            {isPast && (
                                <div className="mt-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                                    <h4 className="mb-2 text-secondary">Leave a Review</h4>
                                    <form onSubmit={(e) => handleReviewSubmit(e, s._id, partner._id)}>
                                        <div className="flex gap-2 mb-2 align-center">
                                            <label>Rating:</label>
                                            <select name="rating" required style={{ padding: '4px', borderRadius: '4px', flex: 1 }}>
                                                <option value="5">5 - Excellent</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="3">3 - Good</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="1">1 - Poor</option>
                                            </select>
                                        </div>
                                        <textarea name="feedback" placeholder="How was the session?" required className="w-100 mb-2" style={{ padding: '8px', minHeight: '60px' }}></textarea>
                                        <button type="submit" className="btn btn-outline w-100 text-center">Submit Review</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default Sessions;

