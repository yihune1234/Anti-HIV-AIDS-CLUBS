import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div style={{ maxWidth: '650px' }}>
                        <h1>Haramaya University <br /><span style={{ color: '#E53935' }}>Anti-HIV/AIDS Club</span></h1>
                        <p>Empowering students through education, awareness, and support. Join us in creating an HIV/AIDS-free generation through knowledge and compassion.</p>
                        <div>
                            <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>Join the Club</Link>
                            <Link to="/about" className="btn btn-outline">Learn More</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why We Exist Section */}
            <section className="values-section">
                <div className="container">
                    <div className="text-center mb-5">
                        <p style={{ color: '#E53935', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Our Impact</p>
                        <h2>Why We Exist</h2>
                        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            We are dedicated to fostering a supportive environment and spreading accurate information across campus.
                        </p>
                    </div>

                    <div className="values-grid">
                        <div className="value-card">
                            <div className="icon-circle">
                                📢
                            </div>
                            <h3>Awareness</h3>
                            <p className="text-muted">Conducting regular campaigns to educate students about prevention, transmission, and treatment.</p>
                        </div>

                        <div className="value-card">
                            <div className="icon-circle">
                                🤝
                            </div>
                            <h3>Support</h3>
                            <p className="text-muted">Providing a safe, non-judgmental space for counseling, questions, and peer support.</p>
                        </div>

                        <div className="value-card">
                            <div className="icon-circle">
                                👥
                            </div>
                            <h3>Community</h3>
                            <p className="text-muted">Building a strong network of student volunteers committed to social responsibility.</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
