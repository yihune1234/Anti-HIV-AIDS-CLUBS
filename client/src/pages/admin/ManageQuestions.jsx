import React, { useState, useEffect } from 'react';
import anonymousQuestionService from '../../services/anonymousQuestionService';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answeringId, setAnsweringId] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [stats, setStats] = useState({ total: 0, pending: 0, answered: 0 });

    // Helper function to get friendly error message
    const getFriendlyError = (error) => {
        if (!error) return 'An unexpected error occurred. Please try again.';
        const errorMsg = error.message || error.response?.data?.message || error.toString();
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        if (lowerMsg.includes('unauthorized') || lowerMsg.includes('token')) {
            return 'Your session has expired. Please log in again.';
        }
        if (lowerMsg.includes('validation') || lowerMsg.includes('invalid')) {
            return 'Please check your input and try again.';
        }
        if (lowerMsg.includes('500') || lowerMsg.includes('server error')) {
            return 'A server error occurred. Please try again later.';
        }
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    useEffect(() => {
        fetchQuestions();
        fetchStats();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await anonymousQuestionService.getAllQuestions();
            let qs = [];
            if (Array.isArray(response.data)) {
                qs = response.data;
            } else if (response.data && Array.isArray(response.data.questions)) {
                qs = response.data.questions;
            } else if (Array.isArray(response)) {
                qs = response;
            }
            setQuestions(qs);
        } catch (error) {
            alert('⚠️ Error loading questions: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await anonymousQuestionService.getQuestionStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.warn('Could not fetch stats');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Permanently delete this question? This cannot be undone.')) {
            try {
                await anonymousQuestionService.deleteQuestion(id);
                alert('✅ Question deleted successfully!');
                setQuestions(questions.filter(q => q._id !== id));
                fetchStats();
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleAnswerSubmit = async (id) => {
        if (!answerText.trim()) return;
        try {
            await anonymousQuestionService.answerQuestion(id, answerText);
            alert('✅ Answer submitted successfully!');
            setAnsweringId(null);
            setAnswerText('');
            fetchQuestions();
            fetchStats();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-danger"></div>
        </div>
    );

    const pendingQuestions = questions.filter(q => q.status === 'pending');
    const answeredQuestions = questions.filter(q => q.status === 'answered');

    return (
        <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .q-card {
                    background: white;
                    border-radius: 20px;
                    padding: clamp(1rem, 5vw, 2rem);
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    border: 1px solid #f0f0f0;
                }
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: inline-block;
                }
                .questions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
                    gap: 2rem;
                }
                @media (max-width: 600px) {
                    .questions-grid {
                        grid-template-columns: 1fr;
                    }
                }
                `}
            </style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '800', margin: 0 }}>Vulnerability Support</h2>
                    <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Manage and respond to anonymous student inquiries.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ background: '#FFF3E0', color: '#EF6C00', padding: '0.8rem 1.2rem', borderRadius: '15px', textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{stats.pending}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '700' }}>PENDING</div>
                    </div>
                    <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '0.8rem 1.2rem', borderRadius: '15px', textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{stats.answered}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: '700' }}>ANSWERED</div>
                    </div>
                </div>
            </div>

            <div className="questions-grid">
                {/* Pending Column */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📥 Incoming Questions <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>{pendingQuestions.length}</span>
                    </h3>

                    {pendingQuestions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: '#f8f9fa', borderRadius: '20px', color: '#999' }}>
                            All caught up! No pending questions.
                        </div>
                    ) : (
                        pendingQuestions.map(q => (
                            <div key={q._id} className="q-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <span className="status-badge" style={{ background: '#FFEBEE', color: '#C62828' }}>
                                        {q.category}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                        {new Date(q.submittedAt || q.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a2e', lineHeight: '1.5', marginBottom: '1.5rem', overflowWrap: 'break-word' }}>
                                    "{q.question}"
                                </p>

                                {answeringId === q._id ? (
                                    <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '15px' }}>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Write a clear, supportive response..."
                                            value={answerText}
                                            onChange={e => setAnswerText(e.target.value)}
                                            style={{ borderRadius: '12px', padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem' }}
                                        ></textarea>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            <button className="btn btn-primary" onClick={() => handleAnswerSubmit(q._id)} disabled={!answerText.trim()}>Post Response</button>
                                            <button className="btn btn-outline" style={{ color: '#555' }} onClick={() => setAnsweringId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <button className="btn btn-primary" style={{ borderRadius: '10px' }} onClick={() => { setAnsweringId(q._id); setAnswerText(''); }}>Answer</button>
                                        <button className="btn btn-outline" style={{ borderRadius: '10px', color: '#C62828', borderColor: '#FFCDD2' }} onClick={() => handleDelete(q._id)}>Dismiss</button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* History Column */}
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', opacity: 0.6 }}>Recently Answered</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {answeredQuestions.length === 0 ? (
                            <p style={{ color: '#ccc', textAlign: 'center' }}>No history yet.</p>
                        ) : (
                            answeredQuestions.slice(0, 10).map(q => (
                                <div key={q._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '15px', border: '1px solid #eee' }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: '0 0 1rem 0', overflowWrap: 'break-word' }}>Q: {q.question.substring(0, 80)}...</p>
                                    <div style={{ fontSize: '0.85rem', color: '#666', padding: '0.8rem', background: '#f0fdf4', borderRadius: '8px', borderLeft: '3px solid #4CAF50', overflowWrap: 'break-word' }}>
                                        {q.answer?.content.substring(0, 100)}...
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#999' }}>{new Date(q.updatedAt).toLocaleDateString()}</span>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            style={{ background: 'none', border: 'none', color: '#ff5252', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '700' }}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageQuestions;
