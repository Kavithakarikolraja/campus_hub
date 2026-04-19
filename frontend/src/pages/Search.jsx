import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const { user } = useContext(AuthContext);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllUsers = async () => {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/users`, config);
                // Remove the current user logic
                setResults(data.filter(u => u._id !== user._id));
            } catch (error) {
                console.error("Failed to fetch initial users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, [user.token, user._id]);

    const handleSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // If query is empty, it can revert to all users
            const url = query.trim() ? `/api/users/search?query=${query}` : '/api/users';
            const { data } = await axios.get(url, config);
            setResults(data.filter(u => u._id !== user._id));
        } catch (error) {
            console.error("Search failed", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-center mb-4">Discover Peers</h1>

            <form onSubmit={handleSearch} className="flex gap-2" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                <input
                    type="text"
                    placeholder="Search by skill (e.g., React, Design) or name..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '25px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '25px', padding: '0 2rem' }}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                {results.length === 0 && !loading && query && (
                    <div className="text-center w-100 text-secondary">No results found for "{query}".</div>
                )}

                {results.map(u => (
                    <div key={u._id} className="glass-panel flex flex-col justify-between" style={{ flex: '1 1 300px' }}>
                        <div>
                            <div className="flex align-center gap-2 mb-2">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 style={{ margin: 0 }}>{u.name}</h3>
                            </div>
                            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{u.department}</p>

                            <div className="mb-2">
                                <strong>Offers:</strong>
                                <div className="flex gap-1 flex-wrap mt-1">
                                    {u.skillsOffered.map((s, idx) => (
                                        <span key={idx} style={{ background: 'rgba(88, 166, 255, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{s.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link to="/chat" className="btn btn-outline text-center w-100 mt-3" style={{ display: 'block' }}>Message</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;

