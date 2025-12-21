import React, { useState, useEffect } from 'react';
import anonymousQuestionService from '../../services/anonymousQuestionService';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answeringId, setAnsweringId] = useState(null);
    const [answerText, setAnswerText] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await anonymousQuestionService.getAllQuestions();
            // Assuming response structure similar to others
            if (response.data && Array.isArray(response.data.questions)) {
                setQuestions(response.data.questions);
            } else if (response.data && Array.isArray(response.data)) {
                setQuestions(response.data);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await anonymousQuestionService.deleteQuestion(id);
                setQuestions(questions.filter(q => q._id !== id));
            } catch (error) {
                alert('Failed to delete question: ' + error);
            }
        }
    };

    const handleAnswerSubmit = async (id) => {
        try {
            await anonymousQuestionService.answerQuestion(id, answerText);
            alert('Question answered successfully');
            setAnsweringId(null);
            setAnswerText('');
            fetchQuestions(); // Refresh to see updated status
        } catch (error) {
            alert('Failed to answer: ' + error);
        }
    };

    if (loading) return <div>Loading...</div>;

    const pendingQuestions = questions.filter(q => !q.isAnswered);
    const answeredQuestions = questions.filter(q => q.isAnswered);

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Manage Anonymous Questions</h2>

            <div className="mb-5">
                <h3 style={{ borderBottom: '2px solid #D32F2F', paddingBottom: '0.5rem', display: 'inline-block' }}>Pending Questions</h3>
                {pendingQuestions.length === 0 ? (
                    <p className="text-muted mt-3">No pending questions.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {pendingQuestions.map(q => (
                            <div key={q._id} className="card">
                                <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>"{q.question}"</p>
                                <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '1rem' }}>
                                    Tag: {q.category || 'General'} • Submitted: {new Date(q.submittedAt || q.createdAt).toLocaleDateString()}
                                </div>

                                {answeringId === q._id ? (
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            placeholder="Type your answer here..."
                                            value={answerText}
                                            onChange={e => setAnswerText(e.target.value)}
                                            style={{ marginBottom: '1rem' }}
                                        ></textarea>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button className="btn btn-primary" onClick={() => handleAnswerSubmit(q._id)}>Submit Answer</button>
                                            <button className="btn btn-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => setAnsweringId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => { setAnsweringId(q._id); setAnswerText(''); }}>Answer</button>
                                        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', color: '#D32F2F', borderColor: '#ffcdd2' }} onClick={() => handleDelete(q._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h3 style={{ borderBottom: '2px solid #1a1a2e', paddingBottom: '0.5rem', display: 'inline-block' }}>Answered History</h3>
                {answeredQuestions.length === 0 ? (
                    <p className="text-muted mt-3">No answered questions yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {answeredQuestions.map(q => (
                            <div key={q._id} className="card" style={{ backgroundColor: '#f9f9f9' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>Q: "{q.question}"</p>
                                <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '4px', borderLeft: '4px solid #4CAF50' }}>
                                    <strong>A:</strong> {q.answer?.content}
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: '#888' }} onClick={() => handleDelete(q._id)}>Remove from history</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageQuestions;
