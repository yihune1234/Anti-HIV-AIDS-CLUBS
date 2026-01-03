import React from 'react';
import { Link } from 'react-router-dom';
import clubImage from '../../assets/image.png';
import logo from '../../assets/logo.png';
import banner from '../../assets/banner.png';

const Home = () => {
    return (
        <div className="home-page" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 0.8; } }
                
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }
                .hero-section {
                    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    position: relative;
                    overflow: hidden;
                    padding: 4rem 0;
                }
                .pillar-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    display: inline-block;
                    animation: float 3s ease-in-out infinite;
                }
                .stat-number {
                    font-size: 3rem;
                    font-weight: 800;
                    background: linear-gradient(to right, #D32F2F, #FF5252);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-logo {
                    width: 80px;
                    height: auto;
                    margin-bottom: 2rem;
                    filter: drop-shadow(0 0 15px rgba(255,82,82,0.3));
                    animation: float 4s ease-in-out infinite;
                }
                .banner-wrapper {
                    border-radius: 30px;
                    overflow: hidden;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                    transform: perspective(1000px) rotateX(2deg);
                    transition: transform 0.5s ease;
                    border: 4px solid rgba(255,255,255,0.1);
                }
                .banner-wrapper:hover {
                    transform: perspective(1000px) rotateX(0deg) scale(1.02);
                }
                `}
            </style>

            {/* Premium Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(450px, 100%), 1fr))', gap: '5rem', alignItems: 'center' }}>
                        <div style={{ animation: 'slideUp 1s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                <img src={logo} alt="Club Logo" className="hero-logo" style={{ margin: 0 }} />
                                <div style={{ height: '50px', width: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
                                <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '1px' }}>Haramaya University<br /><span style={{ color: '#FF5252' }}>Anti-HIV/AIDS Club</span></span>
                            </div>

                            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '2rem' }}>
                                Empowering University Students and Community<br /> <span style={{ color: '#FF5252' }}>Against HIV/AIDS</span>
                            </h1>

                            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '600px' }}>
                                Founded by students at Haramaya University, we champion HIV prevention, voluntary testing, peer support, and stigma-free care across our campus community.
                            </p>

                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '18px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(211,47,47,0.3)' }}>
                                    Become a Member
                                </Link>
                                <Link to="/about" className="btn btn-outline" style={{ padding: '1.2rem 3rem', borderRadius: '18px', color: 'white', borderColor: 'rgba(255,255,255,0.3)', fontWeight: '800' }}>
                                    Learn Our Story
                                </Link>
                            </div>
                        </div>

                        <div style={{ animation: 'fadeIn 1.5s ease' }}>
                            <div className="banner-wrapper">
                                <img
                                    src={banner}
                                    alt="HU Anti-HIV/AIDS Awareness Banner"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div>

                            {/* Floating Stats */}
                            <div style={{
                                display: 'flex',
                                gap: '2rem',
                                marginTop: '3rem',
                                justifyContent: 'space-around',
                                animation: 'slideUp 1.2s ease'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#FF5252', fontSize: '2.5rem', fontWeight: '900' }}>25+</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Years</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#FF5252', fontSize: '2.5rem', fontWeight: '900' }}>1k+</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Members</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#FF5252', fontSize: '2.5rem', fontWeight: '900' }}>VCT</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Leadership</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Pillars Section */}
            <section className="py-5" style={{ background: '#fcfcfc' }}>
                <div className="container py-5">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>Our <span style={{ color: '#D32F2F' }}>Core DNA</span></h2>
                        <p style={{ color: '#666', fontSize: '1.2rem' }}>The engine that drives our advocacy on campus.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '3rem' }}>
                        {[
                            {
                                icon: '🛡️',
                                title: 'Awareness',
                                desc: 'We host high-impact workshops, creative dramas, and digital campaigns that educate the mind and touch the heart.',
                                color: '#1E88E5'
                            },
                            {
                                icon: '🤝',
                                title: 'Unity & Support',
                                desc: 'A judgment-free ecosystem where counseling and brotherly support are just a conversation away.',
                                color: '#43A047'
                            },
                            {
                                icon: '🚀',
                                title: 'Action & Leadership',
                                desc: 'We mobilize. We volunteer. We lead. Transforming students into public health champions.',
                                color: '#EF6C00'
                            }
                        ].map((pillar, idx) => (
                            <div key={idx} className="card" style={{
                                padding: '3rem',
                                textAlign: 'center',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 15px 50px rgba(0,0,0,0.05)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div className="pillar-icon" style={{ animationDelay: `${idx * 0.2}s` }}>{pillar.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.2rem' }}>{pillar.title}</h3>
                                <p style={{ color: '#666', lineHeight: '1.6' }}>{pillar.desc}</p>
                                <div style={{ height: '4px', width: '40px', background: pillar.color, margin: '1.5rem auto 0', borderRadius: '2px' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience HU Anti-HIV Section */}
            <section className="py-5" style={{ background: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '5rem', alignItems: 'center' }}>
                        <div style={{ borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                            <img
                                src={clubImage}
                                alt="Haramaya University Anti HIV / AIDS Club"
                                style={{ width: '100%', height: '500px', objectFit: 'cover', backgroundColor: '#ffffff' }}
                            />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.2' }}>
                                A Vibrant <span style={{ color: '#D32F2F' }}>Community</span> Built on Trust
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '1rem', borderRadius: '15px', height: 'fit-content' }}>✨</div>
                                    <div>
                                        <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Peer-Led Approach</h4>
                                        <p style={{ color: '#666' }}>Students talking to students. No barriers, just real conversations about health and lifestyle.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ background: '#E3F2FD', color: '#1E88E5', padding: '1rem', borderRadius: '15px', height: 'fit-content' }}>🎯</div>
                                    <div>
                                        <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Clinical Partnership</h4>
                                        <p style={{ color: '#666' }}>Seamless integration with HU Health Services for testing, clinical care, and referrals.</p>
                                    </div>
                                </div>
                            </div>
                            <Link to="/awareness" className="btn btn-outline" style={{ marginTop: '3rem', borderRadius: '12px', padding: '1rem 2rem' }}>
                                Learn How We Educate →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stories */}
            <section className="py-5" style={{ background: '#f8f9fa' }}>
                <div className="container py-5">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Impact <span style={{ color: '#D32F2F' }}>Highlights</span></h2>
                            <p style={{ color: '#666' }}>Stories from our latest initiatives and movements.</p>
                        </div>
                        <Link to="/login" style={{ color: '#D32F2F', fontWeight: '700' }}>View All Stories →</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2.5rem' }}>
                        {[
                            {
                                img: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                                date: 'Oct 15, 2024',
                                title: 'National Youth Health Summit',
                                tags: ['Summit', 'HU Presence']
                            },
                            {
                                img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                                date: 'Nov 01, 2024',
                                title: 'Testing Without Borders Week',
                                tags: ['VCT', 'Impact']
                            },
                            {
                                img: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                                date: 'Dec 10, 2024',
                                title: 'Creative Advocacy Awards',
                                tags: ['Art', 'Recognition']
                            }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', border: 'none', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                                <div style={{ height: '300px', backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                <div style={{ padding: '2.5rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#D32F2F', fontWeight: '800', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        {item.tags.map(t => <span key={t} style={{ background: '#FFEBEE', padding: '4px 12px', borderRadius: '50px' }}>{t}</span>)}
                                    </div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>{item.title}</h4>
                                    <p style={{ color: '#777', fontSize: '0.95rem' }}>{item.date} • Read more about this event and its impact on the community.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-5" style={{ background: '#1a1a2e', position: 'relative', overflow: 'hidden' }}>
                <div className="container py-5" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ color: 'white', fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: '900', marginBottom: '2rem' }}>
                        Be the Voice of <span style={{ color: '#FF5252' }}>Change</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
                        Our club has been a beacon of hope for 25 years. Join us today and help us write the next chapter of health and unity at Haramaya University.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 3.5rem', borderRadius: '20px', fontWeight: '800', fontSize: '1.2rem' }}>
                            Join the Family
                        </Link>
                        <Link to="/questions" className="btn btn-outline" style={{ padding: '1.2rem 3.5rem', borderRadius: '20px', color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontWeight: '800', fontSize: '1.2rem' }}>
                            Ask Anonymously
                        </Link>
                    </div>
                </div>
                {/* Decorative background circle */}
                <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(211,47,47,0.1) 0%, transparent 70%)' }}></div>
            </section>
        </div>
    );
};

export default Home;

