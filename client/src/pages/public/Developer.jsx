import React from 'react';

const Developer = () => {
    return (
        <div className="developer-page" style={{ animation: 'fadeIn 0.8s ease', background: '#fcfcfc', minHeight: '100vh', padding: '100px 0' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }

                .dev-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    padding: clamp(2.5rem, 8vw, 5rem) clamp(1rem, 5vw, 2.5rem);
                    border-radius: 40px;
                    color: white;
                    text-align: center;
                    margin-bottom: 4rem;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.1);
                }
                .dev-avatar {
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    border: 8px solid rgba(255,255,255,0.1);
                    margin: 0 auto 2.5rem;
                    background: #c62828;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: clamp(3rem, 10vw, 5rem);
                    animation: float 4s ease-in-out infinite;
                }
                .dev-card {
                    background: white;
                    padding: clamp(1.5rem, 5vw, 3rem);
                    border-radius: 30px;
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s ease;
                }
                .dev-card:hover {
                    border-color: #c62828;
                    transform: translateY(-5px);
                }
                .connect-link {
                    padding: 1.2rem;
                    background: #f8fafc;
                    border-radius: 18px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    text-decoration: none;
                    color: #1e293b;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                .connect-link:hover {
                    background: #c62828;
                    color: white;
                }
                `}
            </style>

            <div className="container" style={{ maxWidth: '1100px' }}>
                <div className="dev-hero">
                    <div className="dev-avatar">👨‍💻</div>
                    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: '900' }}>
                        Yihune Belay Sebsibe
                    </h1>
                    <p style={{ fontSize: '1.4rem', opacity: 0.8 }}>
                        Software Engineering Student • Haramaya University
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem' }}>
                    <div className="dev-card">
                        <h2 style={{ color: '#c62828', fontWeight: '900', marginBottom: '1.5rem' }}>
                            About the Developer
                        </h2>
                        <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1.1rem' }}>
                            I am a passionate software engineering student focused on building meaningful,
                            user-centered digital solutions. I enjoy turning real-world problems into
                            clean, practical systems that are simple to use and easy to maintain.
                        </p>
                        <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1.1rem', marginTop: '1.5rem' }}>
                            This project reflects my dedication to responsibility, clarity, and impact.
                            I believe technology should serve people, not complicate their lives.
                        </p>
                    </div>

                    <div className="dev-card">
                        <h2 style={{ color: '#c62828', fontWeight: '900', marginBottom: '1.5rem' }}>
                            Work With Me
                        </h2>
                        <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1.1rem' }}>
                            If you have a project, idea, or collaboration opportunity,
                            feel free to contact <strong>Yihune</strong>.
                            I’m always open to meaningful and impactful work.
                        </p>
                    </div>

                    <div className="dev-card">
                        <h2 style={{ color: '#c62828', fontWeight: '900', marginBottom: '1.5rem' }}>
                            Contact
                        </h2>
                        {[
                            { label: 'Portfolio', icon: '🌐', url: 'https://yihunebelayportfolio.onrender.com/' },
                            { label: 'GitHub', icon: '💻', url: 'https://github.com/yihune1234' },
                            { label: 'LinkedIn', icon: '🔗', url: 'https://www.linkedin.com/in/yihune-belay-30b0a4383' },
                            { label: 'Telegram', icon: '✈️', url: 'https://t.me/Y13bel' }
                        ].map(link => (
                            <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="connect-link">
                                <span>{link.icon} {link.label}</span>
                                <span>→</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5rem', opacity: 0.6 }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                        “If you have a project, contact Yihune.”
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Developer;
