import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const QA_DATABASE = {
    technical: [
        "To clear technical rounds, brush up on Data Structures, Algorithms, and System Design.",
        "Practice LeetCode regularly and build end-to-end projects like a full-stack e-commerce site.",
        "Make sure to thoroughly understand the framework you are using and its fundamentals."
    ],
    communication: [
        "For communication rounds, practice speaking clearly and concisely. Try the STAR method for behavioral questions.",
        "Listen actively, take a pause before responding, and don't be afraid to ask clarifying questions.",
        "Mock interviews with peers are the best way to improve your impromptu speaking skills."
    ],
    aptitude: [
        "Aptitude tests usually cover quantitative, logical reasoning, and verbal skills.",
        "Time management is critical. Skip hard questions and secure the easy marks first.",
        "Practice using RS Aggarwal or online platforms like IndiaBix to improve speed."
    ]
};

const AiChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi there! I am your AI Assistant. Ask me a basic doubt about technical, communication, or aptitude preparation!' }
    ]);
    const [inputStr, setInputStr] = useState('');

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputStr.trim()) return;

        const userMsg = inputStr.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputStr('');

        setTimeout(() => {
            let reply = "I'm not sure about that. Try asking about technical, communication, or aptitude doubt!";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('tech') || lowerMsg.includes('code') || lowerMsg.includes('programming')) {
                reply = QA_DATABASE.technical[Math.floor(Math.random() * QA_DATABASE.technical.length)];
            } else if (lowerMsg.includes('comm') || lowerMsg.includes('speak') || lowerMsg.includes('english')) {
                reply = QA_DATABASE.communication[Math.floor(Math.random() * QA_DATABASE.communication.length)];
            } else if (lowerMsg.includes('apt') || lowerMsg.includes('math') || lowerMsg.includes('logic')) {
                reply = QA_DATABASE.aptitude[Math.floor(Math.random() * QA_DATABASE.aptitude.length)];
            }

            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        }, 800);
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="glass-panel"
                        style={{ width: '320px', height: '400px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1rem', background: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontWeight: 'bold' }}>
                                <Bot size={20} /> Campus AI
                            </div>
                            <button onClick={toggleChat} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{ alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                                    <div style={{
                                        background: m.sender === 'bot' ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
                                        color: 'white',
                                        padding: '10px 14px',
                                        borderRadius: m.sender === 'bot' ? '12px 12px 12px 0' : '12px 12px 0 12px',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4
                                    }}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '0.8rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
                            <input
                                type="text"
                                placeholder="Ask a doubt..."
                                value={inputStr}
                                onChange={(e) => setInputStr(e.target.value)}
                                style={{ margin: 0, flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '8px 15px', border: '1px solid var(--border-color)' }}
                            />
                            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(255, 91, 91, 0.4)'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.button>
        </div>
    );
};

export default AiChatbot;

