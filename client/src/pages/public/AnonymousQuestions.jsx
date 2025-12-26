import React, { useState, useEffect } from 'react';
import anonymousQuestionService from '../../services/anonymousQuestionService';

const AnonymousQuestions = () => {
    const [category, setCategory] = useState('HIV/AIDS');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [publicQuestions, setPublicQuestions] = useState([]);

    const categories = [
        'HIV/AIDS', 'Sexual Health', 'Mental Health', 'Substance Abuse',
        'Relationships', 'Prevention', 'Treatment', 'Testing', 'Stigma', 'Support', 'General Health', 'Other'
    ];

    useEffect(() => {
        fetchPublicQuestions();
    }, []);

    const fetchPublicQuestions = async () => {
        try {
            const response = await anonymousQuestionService.getPublicQuestions();
            // response is the body: { success, data, pagination }
            let extractedQuestions = [];
            if (Array.isArray(response.data)) {
                extractedQuestions = response.data;
            } else if (response.data && Array.isArray(response.data.questions)) {
                extractedQuestions = response.data.questions;
            } else if (Array.isArray(response)) {
                extractedQuestions = response;
            }
            setPublicQuestions(extractedQuestions.filter(q => q.status === 'answered'));
        } catch (err) {
            console.error('Failed to fetch public questions:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await anonymousQuestionService.askQuestion({
                question,
                category
            });
            setSubmitted(true);
            setQuestion('');
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper" style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .question-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid #f0f0f0;
                    transition: transform 0.3s ease;
                }
                .question-card:hover { transform: translateY(-5px); }
                `}
            </style>

            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white', padding: 'clamp(3rem, 10vw, 5rem) 0', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '800', marginBottom: '1rem' }}>Confidential <span style={{ color: '#D32F2F' }}>Questions</span></h1>
                    <p style={{ opacity: 0.8, fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Your identity remains 100% anonymous. Our professional counselors are here to provide accurate, non-judgmental information.
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '4rem' }}>

                    {/* Ask Form */}
                    <div>
                        <h2 style={{ marginBottom: '2rem', fontWeight: '800' }}>Submit a Question</h2>
                        <div style={{ backgroundColor: '#FFF9C4', padding: '1.5rem', borderRadius: '15px', color: '#827717', marginBottom: '2rem', fontSize: '0.9rem', borderLeft: '5px solid #FBC02D' }}>
                            <strong>Privacy Shield:</strong> We do not track your IP or account. This form is completely disconnected from your member profile.
                        </div>

                        <form onSubmit={handleSubmit} className="card" style={{ padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
                            {error && (
                                <div style={{ backgroundColor: '#FFEBEE', color: '#D32F2F', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    {error}
                                </div>
                            )}

                            {submitted && (
                                <div style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                                    ✓ Question submitted safely! It will be reviewed soon.
                                </div>
                            )}

                            <div className="form-group mb-4">
                                <label className="form-label" style={{ fontWeight: '700' }}>Topic Area</label>
                                <select
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ borderRadius: '12px', padding: '0.8rem' }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label" style={{ fontWeight: '700' }}>Your Anonymous Question</label>
                                <textarea
                                    className="form-control"
                                    rows="6"
                                    placeholder="Be as specific as you like..."
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    required
                                    style={{ borderRadius: '15px', padding: '1rem' }}
                                    readOnly={loading}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: '800' }}
                                disabled={loading}
                            >
                                {loading ? 'Submitting Securely...' : 'Send Anonymously'}
                            </button>
                        </form>
                    </div>

                    {/* FAQ / Recent Answered */}
                    <div>
                        <h2 style={{ marginBottom: '2rem', fontWeight: '800' }}>Answered Board</h2>
                        {publicQuestions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                                <p>No questions have been published yet. Be the first to ask!</p>
                            </div>
                        ) : (
                            <div>
                                {publicQuestions.map(q => (
                                    <div key={q._id} className="question-card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#D32F2F', background: '#FFEBEE', padding: '4px 12px', borderRadius: '100px' }}>
                                                {q.category.toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>
                                                {new Date(q.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem', color: '#1a1a2e' }}>
                                            " {q.question} "
                                        </p>
                                        <div style={{ backgroundColor: '#F8F9FA', padding: '1.5rem', borderRadius: '15px', borderLeft: '4px solid #D32F2F' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#555', marginBottom: '0.5rem' }}>COUNSELOR RESPONSE:</div>
                                            <p style={{ margin: 0, color: '#444', lineHeight: '1.6' }}>
                                                {q.answer?.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnonymousQuestions;

