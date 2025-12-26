import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="about-page" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideRight { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                
                .about-hero {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    padding: clamp(60px, 15vw, 120px) 0;
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                }
                .journey-card {
                    background: white;
                    border-radius: 30px;
                    padding: clamp(1.5rem, 5vw, 3rem);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.05);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .journey-card:hover {
                    transform: scale(1.02);
                    box-shadow: 0 30px 80px rgba(0,0,0,0.08);
                }
                .leadership-avatar {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    border: 8px solid white;
                    box-shadow: 0 10px 30px rgba(211,47,47,0.2);
                    margin-bottom: 2rem;
                }
                `}
            </style>

            {/* Majestic Hero */}
            <section className="about-hero">
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: '900', color: 'white', marginBottom: '1.5rem' }}>Our History, <br /><span style={{ color: '#FF5252' }}>Our Identity</span></h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto' }}>
                        Over two decades of dedication to health, peer support, and inclusive community building at Haramaya University.
                    </p>
                </div>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(211,47,47,0.15) 0%, transparent 70%)' }}></div>
            </section>

            {/* The Story Section */}
            <section className="py-5" style={{ background: '#fcfcfc' }}>
                <div className="container py-5">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: 'clamp(2rem, 8vw, 5rem)', alignItems: 'center' }}>
                        <div style={{ animation: 'slideRight 1s ease' }}>
                            <span style={{ color: '#D32F2F', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>SINCE 1998</span>
                            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.2' }}>From a Vision to a <br />Campus <span style={{ color: '#D32F2F' }}>Legacy</span></h2>
                            <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                Founded during the height of the HIV epidemic in Ethiopia, our club emerged as a beacon of hope and a fortress of knowledge. What began as a small student initiative has grown into a powerful movement influencing thousands of lives every academic year.
                            </p>
                            <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: '1.8' }}>
                                Today, we are proud partners of global health initiatives and university mandates, ensuring that every student has access to the truth, the tools, and the support they need to stay safe and healthy.
                            </p>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
                                alt="Students in discussion"
                                style={{ width: '100%', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}
                            />
                            <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#D32F2F', color: 'white', padding: '1.5rem 2.5rem', borderRadius: '20px', fontWeight: '800', fontSize: '1.2rem' }}>
                                30,000+ Students Reached
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pillars Section with modern cards */}
            <section className="py-5" style={{ background: 'white' }}>
                <div className="container py-5">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Our Functional <span style={{ color: '#D32F2F' }}>Framework</span></h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                        {[
                            { title: 'The Executive', desc: 'Elected student leaders who orchestrate all club operations, from budgeting to grand events.' },
                            { title: 'Peer Educators', desc: 'A elite group of trained advocates who deliver evidence-based education directly to their peers.' },
                            { title: 'Volunteer Corps', desc: 'The heart of our activities—hundreds of students who give their time for community outreach.' }
                        ].map((item, idx) => (
                            <div key={idx} className="journey-card" style={{ borderTop: `6px solid ${idx === 1 ? '#D32F2F' : '#1a1a2e'}` }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>{item.title}</h3>
                                <p style={{ color: '#666', lineHeight: '1.7', fontSize: '1.05rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Spotlight */}
            <section className="py-5" style={{ background: 'linear-gradient(rgba(240,240,240,0.5), rgba(240,240,240,0.5))' }}>
                <div className="container py-5">
                    <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: 'clamp(2rem, 8vw, 5rem) clamp(1rem, 5vw, 3rem)', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div className="leadership-avatar" style={{ background: 'linear-gradient(135deg, #D32F2F, #FF5252)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4rem', fontWeight: '900' }}>
                            MA
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Meraol Abdulkader</h2>
                        <span style={{ color: '#D32F2F', fontWeight: '800', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', display: 'block' }}>President</span>
                        <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.8', fontStyle: 'italic' }}>
                            "Our mission is simple yet profound: to build a campus where health is a shared responsibility and stigma has no place. Every student we educate is a life we help protect."
                        </p>
                    </div>
                </div>
            </section>

            {/* Developer Section - Much more professional */}
            <section className="py-5" style={{ background: 'white' }}>
                <div className="container py-5">
                    <div style={{
                        background: '#1a1a2e',
                        borderRadius: '40px',
                        padding: 'clamp(2rem, 8vw, 4rem)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4rem',
                        flexWrap: 'wrap',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ flex: '1', minWidth: '300px', zIndex: 1, textAlign: 'center' }}>
                            <span style={{ color: '#FF5252', fontWeight: '700', letterSpacing: '1px', display: 'block', marginBottom: '1rem' }}>ENGINEERING EXCELLENCE</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', marginBottom: '1.5rem' }}>System Development</h2>
                            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8', marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
                                This comprehensive digital platform was missioned and developed by <strong>Yihune Belay Sebsibe</strong>, a Software Engineering student at Haramaya University. It represents a professional commitment to advancing the club's impact through a dedicated digital presence.
                            </p>
                            <Link to="/developer" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '1rem 2.5rem', borderRadius: '15px', fontWeight: '700' }}>
                                About the Developer →
                            </Link>
                        </div>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(211,47,47,0.1) 0%, transparent 70%)' }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

