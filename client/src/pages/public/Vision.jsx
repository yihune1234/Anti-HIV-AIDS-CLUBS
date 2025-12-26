import React from 'react';

const Vision = () => {
    return (
        <div className="vision-page" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .vision-hero {
                    background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1460666882202-e664939d731e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80");
                    background-size: cover;
                    background-position: center;
                    padding: 140px 0;
                    text-align: center;
                    color: white;
                }
                .vision-quote-card {
                    background: white;
                    padding: clamp(1.5rem, 8vw, 4rem);
                    border-radius: 40px;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.06);
                    position: relative;
                    margin-top: clamp(-100px, -15vw, -60px); /* Refined negative margin */
                    z-index: 10;
                    text-align: center;
                    animation: scaleIn 1s ease;
                }
                .value-item {
                    padding: 2.5rem;
                    background: white;
                    border-radius: 25px;
                    transition: all 0.3s ease;
                    border: 1px solid #f0f0f0;
                }
                .value-item:hover {
                    border-color: #D32F2F;
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(211,47,47,0.05);
                }
                `}
            </style>

            {/* Vision Hero */}
            <section className="vision-hero">
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)', fontWeight: '900', color: 'white', marginBottom: '1rem' }}>Vision & Mission</h1>
                    <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>The compass that guides our every endeavor.</p>
                </div>
            </section>

            <div className="container">
                <div className="vision-quote-card">
                    <div style={{ color: '#D32F2F', fontSize: '3rem', lineHeight: '1', marginBottom: '1rem', fontFamily: 'serif' }}>“</div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: '800', fontStyle: 'italic', lineHeight: '1.4', maxWidth: '800px', margin: '0 auto', color: '#1a1a2e' }}>
                        To see an HIV/AIDS-free university youth community where zero new infections, zero stigma, and zero AIDS-related deaths are no longer just goals, but a vibrant reality.
                    </h2>
                    <div style={{ color: '#D32F2F', fontSize: '3rem', lineHeight: '1', marginTop: '1rem', fontFamily: 'serif', transform: 'rotate(180deg)', display: 'inline-block' }}>“</div>
                    <div style={{ marginTop: '2rem', height: '4px', width: '60px', background: '#D32F2F', margin: '2rem auto 0', borderRadius: '2px' }}></div>
                    <p style={{ marginTop: '1.5rem', fontWeight: '800', color: '#D32F2F', letterSpacing: '2px' }}>OUR VISION</p>
                </div>

                {/* Mission Section */}
                <section className="py-5" style={{ marginTop: '5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: '#D32F2F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>OUR MISSION</span>
                            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '900', marginBottom: '1.5rem' }}>Strategic <span style={{ color: '#D32F2F' }}>Mobilization</span></h2>
                            <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: '1.8', marginBottom: '2rem' }}>
                                To mobilize students, staff, and leadership through evidence-based education, peer-led advocacy, and social mobilization. We strive to prevent the spread of HIV, eliminate prejudice, and provide comprehensive support for those affected.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Foster science-based education for all.',
                                    'Eliminate stigma through empathy-led awareness.',
                                    'Provide confidential peer-to-peer counseling.',
                                    'Build a bridge to clinical health services.'
                                ].map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', alignItems: 'center', fontSize: '1.05rem', color: '#444' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D32F2F', fontSize: '0.7rem', fontWeight: 'bold' }}>✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                alt="Mission in action"
                                style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </section>

                {/* Core Values Section */}
                <section className="py-5" style={{ marginBottom: '5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '900' }}>Our Core <span style={{ color: '#D32F2F' }}>Values</span></h2>
                        <p style={{ color: '#666', fontSize: '1.1rem' }}>The non-negotiable principles that define our character.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2.5rem' }}>
                        {[
                            { title: 'Inclusivity', desc: 'A safe haven for everyone, welcoming students from all walks of life without judgment.', icon: '🌍' },
                            { title: 'Confidentiality', desc: 'Trust is our currency. We maintain absolute privacy in every interaction.', icon: '🔒' },
                            { title: 'Empowerment', desc: 'Transforming passive listeners into active health champions and leaders.', icon: '⚡' },
                            { title: 'Integrity', desc: 'Honesty and scientific accuracy in every piece of info we share.', icon: '🤝' }
                        ].map((v, i) => (
                            <div key={i} className="value-item">
                                <div style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>{v.icon}</div>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>{v.title}</h4>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Vision;

