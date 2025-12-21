import React, { useState } from 'react';


const AnonymousQuestions = () => {
    const [topic, setTopic] = useState('General Information');
    const [question, setQuestion] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for submission logic
        console.log({ topic, question });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setQuestion('');
    };

    return (
        <div className="page-wrapper">
            <div style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <h1>Ask Anonymously</h1>
                    <p style={{ opacity: 0.8 }}>Your privacy is our priority. Ask any sensitive question safely.</p>
                </div>
            </div>

            <div className="container py-5">
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                    <div className="info-block" style={{ backgroundColor: '#fff8e1', border: '1px solid #ffe0b2', color: '#8d6e63' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            ⚠️ We do not collect your name, email, or IP address. Your question will be reviewed by a counselor and answered on the public board if appropriate.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
                        <div className="form-group mb-4">
                            <label className="form-label">Topic</label>
                            <select
                                className="form-control"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            >
                                <option>General Information</option>
                                <option>Testing & Counseling</option>
                                <option>Treatment & Care</option>
                                <option>Stigma & Support</option>
                            </select>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label">Your Question</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Type your question here..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {submitted ? 'Question Submitted!' : 'Submit Question'}
                        </button>
                    </form>
                </div>
            </div>


        </div>
    );
};

export default AnonymousQuestions;
