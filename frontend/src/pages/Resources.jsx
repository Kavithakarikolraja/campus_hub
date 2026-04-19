import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Resources = () => {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
    const [linkUrl, setLinkUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    // For demo purposes, keep local interactions state
    const [interactions, setInteractions] = useState({});

    const fetchResources = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/resources', config);
            // Append random mock likes/comments for UI demonstration
            const demoData = data.map(res => ({
                ...res,
                likes: Math.floor(Math.random() * 30),
                comments: Math.floor(Math.random() * 10)
            }));
            setResources(demoData);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [user.token]);

    const handleUpload = async (e) => {
        e.preventDefault();

        // If type is file, file must exist. If link, linkUrl must exist.
        if (!title) return;
        if (uploadType === 'file' && !file) return;
        if (uploadType === 'link' && !linkUrl) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        if (uploadType === 'file') {
            formData.append('file', file);
        } else {
            // Simulated link upload by putting URL in description or a custom field if backend supported it.
            // Since backend is basic, we will append it to description.
            formData.append('description', `${description}\n\nShared Link: ${linkUrl}`);
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post('/api/resources', formData, config);
            setTitle('');
            setDescription('');
            setFile(null);
            setLinkUrl('');
            fetchResources();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Study Resources</h1>

            <div className="glass-panel mb-4" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                <h3>Share a Resource</h3>
                <div className="flex gap-4 mb-3 mt-2">
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="radio" checked={uploadType === 'file'} onChange={() => setUploadType('file')} /> Upload File/Image
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input type="radio" checked={uploadType === 'link'} onChange={() => setUploadType('link')} /> Share Web Link
                    </label>
                </div>

                <form onSubmit={handleUpload} className="flex flex-col gap-2">
                    <input type="text" placeholder="Title (e.g., React Cheatsheet)" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <textarea placeholder="Description or thoughts..." value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />

                    {uploadType === 'file' ? (
                        <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} required style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
                    ) : (
                        <input type="url" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required />
                    )}

                    <button type="submit" className="btn btn-primary mt-2" disabled={uploading}>
                        {uploading ? 'Sharing...' : 'Share Resource'}
                    </button>
                </form>
            </div>

            {loading ? <div className="text-center">Loading resources...</div> : (
                <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                    {resources.map(res => (
                        <div key={res._id} className="glass-panel flex flex-col justify-between" style={{ flex: '1 1 300px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{res.title}</h4>
                                <p className="text-secondary mb-2" style={{ whiteSpace: 'pre-wrap' }}>{res.description}</p>
                                <p className="text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--success)' }}>Shared by:</span> {res.uploadedBy?.name}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2 mt-auto">
                                <a href={res.fileUrl ? `${axios.defaults.baseURL || ''}${res.fileUrl}` : '#'} target="_blank" rel="noopener noreferrer" className="btn w-100 text-center" style={{ display: 'block', background: 'rgba(88, 166, 255, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                                    {res.fileUrl ? 'View Attachment' : 'View Link inside Description'}
                                </a>

                                <div className="flex gap-4 border-t pt-2 mt-2" style={{ borderTop: '1px solid var(--border-color)', justifyContent: 'center' }}>
                                    <button
                                        onClick={() => setInteractions({ ...interactions, [`like-${res._id}`]: (interactions[`like-${res._id}`] || 0) + 1 })}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        👍 {res.likes + (interactions[`like-${res._id}`] || 0)}
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        💬 {res.comments}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {resources.length === 0 && <p className="text-center w-100 text-secondary">No resources available. Be the first to upload one!</p>}
                </div>
            )}
        </div>
    );
};

export default Resources;

