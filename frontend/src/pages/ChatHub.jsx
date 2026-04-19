import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatHub = () => {
    const { user, socket } = useContext(AuthContext); // Use global connected socket
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Chat state
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [room, setRoom] = useState("");
    const [unreadMessages, setUnreadMessages] = useState({});

    const bottomRef = useRef(null);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleData, setScheduleData] = useState({ date: '', time: '', duration: 15, link: '' });
    const [activeProjectId, setActiveProjectId] = useState(null);

    // Fetch all users to chat with and setup global socket
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/users', config);
                setUsers(data.filter(u => u._id !== user._id));

                // Register user to their personal notification room
                if (socket) {
                    socket.emit("setup_user", user._id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [user.token, user._id, socket]);

    // Handle incoming messages
    useEffect(() => {
        if (!socket) return;
        const receiveMessageHandler = (data) => {
            // If we are currently in the room the message belongs to, add it to the chat
            if (data.room === room) {
                setMessageList((list) => [...list, data]);
            } else {
                // Otherwise, increment the unread counter for that sender
                setUnreadMessages(prev => ({
                    ...prev,
                    [data.authorId]: (prev[data.authorId] || 0) + 1
                }));
            }
        };

        socket.on("receive_message", receiveMessageHandler);

        return () => {
            socket.off("receive_message", receiveMessageHandler);
        };
    }, [room, socket]);

    // Scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    // Check for a passed targetUser to initiate immediately
    useEffect(() => {
        if (location.state?.targetUser) {
            selectChat(location.state.targetUser);
            if (location.state?.projectId) {
                setActiveProjectId(location.state.projectId);
            }
            // Clear router state to avoid re-triggering on history manipulations
            window.history.replaceState({}, document.title);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    // Select a user to chat with (creates a unique room)
    const selectChat = async (targetUser) => {
        if (!targetUser || !user) return;
        
        const newRoom = [String(user._id), String(targetUser._id)].sort().join('_');
        setRoom(newRoom);
        setSelectedUser(targetUser);
        if (socket) socket.emit("join_room", newRoom);

        // Load chat history from DB
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/messages/${newRoom}`, config);
            const history = data.map(msg => ({
                room: msg.room,
                author: msg.authorName,
                authorId: msg.authorId,
                message: msg.text,
                time: msg.time
            }));
            setMessageList(history);
        } catch (error) {
            console.error("Failed to fetch history", error);
            setMessageList([]);
        }

        // Clear unread count for this user
        setUnreadMessages(prev => ({
            ...prev,
            [targetUser._id]: 0
        }));
    };

    const sendMessage = async () => {
        if (currentMessage !== "" && socket) {
            const messageData = {
                room: room,
                author: user.name,
                authorId: user._id,
                message: currentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    const handleScheduleSession = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/sessions', {
                providerId: selectedUser._id,
                date: scheduleData.date,
                time: scheduleData.time,
                duration: scheduleData.duration,
                link: scheduleData.link,
                projectId: activeProjectId // This handles associating the session with the project
            }, config);
            setShowScheduleModal(false);
            alert("Session legally scheduled!");
            setScheduleData({ date: '', time: '', duration: 15, link: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to schedule session!");
        }
    };

    return (
        <div className="animate-fade-in flex gap-3" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Sidebar: User List */}
            <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <h3 className="mb-3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Peers</h3>
                {users.length === 0 ? (
                    <p className="text-secondary">No other users found.</p>
                ) : (
                    <div className="flex flex-col gap-1">
                        {users.map(u => (
                            <div
                                key={u._id}
                                onClick={() => selectChat(u)}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    background: selectedUser?._id === u._id ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
                                    borderLeft: selectedUser?._id === u._id ? '3px solid var(--primary)' : '3px solid transparent',
                                    borderRadius: '0 8px 8px 0',
                                    transition: 'background 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                            >
                                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {u.name}
                                        {unreadMessages[u._id] > 0 && (
                                            <span style={{
                                                background: 'var(--accent)',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '2px 6px',
                                                borderRadius: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                {unreadMessages[u._id]} new
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.department}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="flex align-center gap-3">
                                <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                                    <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Real-time Peer-to-Peer Chat</span>
                                </div>
                            </div>
                            <button onClick={() => setShowScheduleModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📅 Schedule Session
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messageList.length === 0 && <div className="text-center text-secondary mt-4">Say hi to {selectedUser.name}!</div>}
                            {messageList.map((msg, idx) => {
                                const isMe = msg.authorId === user._id;
                                return (
                                    <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        <div style={{
                                            background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            padding: '10px 15px',
                                            borderRadius: isMe ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                            color: isMe ? '#fff' : 'var(--text-primary)',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.1)' }}>
                            <input
                                type="text"
                                placeholder={`Message ${selectedUser.name}...`}
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                style={{ margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '25px', padding: '12px 20px', flex: 1 }}
                            />
                            <button
                                onClick={sendMessage}
                                className="btn btn-primary"
                                style={{ borderRadius: '25px', padding: '0 25px', display: 'flex', alignItems: 'center' }}
                            >
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                        <h3>Select a peer to start chatting</h3>
                        <p className="text-secondary">Collaborate with students across different departments.</p>
                    </div>
                )}
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        <h2 className="mb-3 text-center">Schedule Session</h2>
                        <form onSubmit={handleScheduleSession} className="flex flex-col">
                            <label className="mb-1">Date</label>
                            <input type="date" required value={scheduleData.date} onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })} className="mb-2" />

                            <label className="mb-1">Time</label>
                            <input type="time" required value={scheduleData.time} onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })} className="mb-2" />

                            <label className="mb-1">Duration (minutes)</label>
                            <input type="number" required min="15" step="15" value={scheduleData.duration} onChange={e => setScheduleData({ ...scheduleData, duration: e.target.value })} className="mb-2" />

                            <label className="mb-1">Meeting Link (e.g., Zoom/Meet)</label>
                            <input type="url" placeholder="https://meet.google.com/..." value={scheduleData.link} onChange={e => setScheduleData({ ...scheduleData, link: e.target.value })} className="mb-3" />

                            <button type="submit" className="btn btn-primary">Schedule Now</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatHub;

