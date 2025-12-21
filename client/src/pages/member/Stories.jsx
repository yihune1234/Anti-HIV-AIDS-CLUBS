import React, { useState, useEffect } from 'react';
import storyService from '../../services/storyService';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storyService.getAllStories();
                // Controller returns: { success: true, data: { stories: [...], pagination: {} } }
                const storyData = response.data;

                if (storyData && Array.isArray(storyData.stories)) {
                    setStories(storyData.stories);
                } else if (Array.isArray(storyData)) {
                    setStories(storyData);
                } else {
                    setStories([]);
                }
            } catch (err) {
                setError('Failed to load stories.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) return <div className="container mt-4 text-center">Loading stories...</div>;
    if (error) return <div className="container mt-4 text-center text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Success Stories & Impact</h1>
            {stories.length === 0 ? (
                <div className="card">
                    <p className="text-center text-muted">No stories shared yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {stories.map(story => (
                        <div key={story._id} className="card">
                            <h3>{story.title}</h3>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Shared by {story.author?.username || 'Anonymous'} on {new Date(story.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2">
                                <p>{story.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Stories;
