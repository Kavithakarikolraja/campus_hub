import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Share, MessageSquare, ThumbsUp } from 'lucide-react';

const Community = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/posts', config);
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user.token]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/posts', { content: newPost }, config);
            setNewPost('');
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/posts/${id}/like`, {}, config);
            fetchPosts(); // Refresh silently
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h1 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Community Feed</h1>

            <div className="glass-panel mb-4">
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
                    <textarea
                        placeholder="Share a tip, trick, or ask a question..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows="3"
                        style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', border: '1px solid var(--border-color)', resize: 'none' }}
                    />
                    <div className="flex justify-end mt-2">
                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Share size={16} /> Post
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center text-secondary">Loading feed...</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {posts.map(post => {
                        const hasLiked = post.likes.includes(user._id);
                        return (
                            <div key={post._id} className="glass-panel hover-glow" style={{ padding: '1.25rem' }}>
                                <div className="flex justify-between align-center mb-2">
                                    <h4 style={{ margin: 0, color: 'var(--primary)' }}>{post.authorName}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(post.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                                <p style={{ lineHeight: '1.5', margin: '0 0 1rem 0' }}>{post.content}</p>

                                <div className="flex gap-4 border-t pt-3" style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                                    <button onClick={() => handleLike(post._id)} style={{ background: hasLiked ? 'var(--primary-alpha)' : 'none', border: 'none', color: hasLiked ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px' }} title="Like">
                                        <ThumbsUp size={16} /> {post.likes.length} Likes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {posts.length === 0 && <p className="text-center text-secondary mt-3">No posts yet. Be the first to start the conversation!</p>}
                </div>
            )}
        </div>
    );
};

export default Community;

