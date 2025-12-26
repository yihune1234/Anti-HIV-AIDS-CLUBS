import React from 'react';

const Awareness = () => {
    return (
        <div className="awareness-page" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .awareness-hero {
                    background: linear-gradient(135deg, #c62828 0%, #b71c1c 100%);
                    padding: 120px 0;
                    text-align: center;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }
                .knowledge-card {
                    background: white;
                    border-radius: 30px;
                    padding: 3rem;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    height: 100%;
                }
                .knowledge-card:hover {
                    box-shadow: 0 30px 70px rgba(198, 40, 40, 0.1);
                    transform: translateY(-8px);
                }
                .stigma-section {
                    background: #0f172a;
                    border-radius: 50px;
                    padding: clamp(2rem, 8vw, 5rem);
                    color: white;
                    margin: 5rem 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
                    gap: 4rem;
                    align-items: center;
                }
                `}
            </style>

            {/* Content Hero */}
            <section className="awareness-hero">
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)', fontWeight: '900', color: 'white', marginBottom: '1.5rem' }}>Knowledge is <br /><span style={{ color: '#ffccbc' }}>Protection</span></h1>
                    <p style={{ fontSize: '1.4rem', opacity: 0.9, maxWidth: '750px', margin: '0 auto' }}>
                        The first step to an HIV-free generation is breaking the myths and embracing the facts.
                    </p>
                </div>
                <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            </section>

            <div className="container py-5">
                <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>Essential <span style={{ color: '#c62828' }}>Truths</span></h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '3rem' }}>
                    {/* HIV Basics */}
                    <div className="knowledge-card">
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🧬</div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#c62828' }}>The Biology of HIV</h3>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            HIV (Human Immunodeficiency Virus) is a virus that attacks the body's immune system, specifically the CD4 cells. If not treated, HIV can lead to AIDS.
                        </p>
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff5f5', borderRadius: '20px', borderLeft: '5px solid #c62828' }}>
                            <strong style={{ color: '#c62828' }}>Pro-Tip:</strong> With modern ART, people living with HIV can lead long, healthy lives and have zero risk of transmitting the virus (U=U).
                        </div>
                    </div>

                    {/* Prevention */}
                    <div className="knowledge-card">
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1565c0' }}>Layered Prevention</h3>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            Protection is about making informed choices. Multiple layers of prevention ensure the highest safety for you and your partner.
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Consistent Condom Use', 'PrEP (Pre-Exposure Prophylaxis)', 'PEP (Post-Exposure Prophylaxis)', 'VMMC (Male Circumcision)'].map(item => (
                                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#1565c0', fontWeight: '700' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1565c0' }}></div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testing */}
                    <div className="knowledge-card">
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.5rem', color: '#2e7d32' }}>The Power of Testing</h3>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.1rem' }}>
                            Knowing your status is the only way to take control of your future. Testing at the HU Clinic is free, fast, and 100% confidential.
                        </p>
                        <ul style={{ marginTop: '2rem', padding: 0, listStyle: 'none' }}>
                            <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '1rem' }}>✅ <span style={{ color: '#555' }}>Private counseling included</span></li>
                            <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '1rem' }}>✅ <span style={{ color: '#555' }}>Rapid results (15-20 mins)</span></li>
                            <li style={{ marginBottom: '0.8rem', display: 'flex', gap: '1rem' }}>✅ <span style={{ color: '#555' }}>Linkage to care if needed</span></li>
                        </ul>
                    </div>
                </div>

                {/* Stigma Section */}
                <div className="stigma-section">
                    <div>
                        <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: '900', color: 'white', marginBottom: '2rem' }}>Erase the <span style={{ color: '#ff5252' }}>Silence</span></h2>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '2.5rem' }}>
                            Fear of stigma is the world's biggest hurdle to ending HIV. When we judge, we push the virus into the shadows where it spreads. When we support, we bring health into the light.
                        </p>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { t: 'Education', d: 'Challenge myths and speak the truth.' },
                                { t: 'Empathy', d: 'Support those living with HIV without judgment.' },
                                { t: 'Action', d: 'Lead by example. Get tested together.' }
                            ].map(item => (
                                <div key={item.t} style={{ borderLeft: '3px solid #ff5252', paddingLeft: '1.5rem' }}>
                                    <h4 style={{ color: 'white', marginBottom: '0.3rem' }}>{item.t}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1543269664-7eef42226a21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                            alt="Ending Stigma"
                            style={{ width: '100%', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}
                        />
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,82,82,0.9)', padding: '1rem 2rem', borderRadius: '20px', fontWeight: '800' }}>
                            No Stigma. Just Support.
                        </div>
                    </div>
                </div>

                {/* Impact Call to Action */}
                <div style={{
                    background: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("https://images.unsplash.com/photo-1584036561566-baf2418309c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                    backgroundSize: 'cover',
                    padding: 'clamp(2rem, 8vw, 5rem)',
                    borderRadius: '40px',
                    textAlign: 'center',
                    border: '1px solid #eee'
                }}>
                    <h3 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Ready to become a Health Advocate?</h3>
                    <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                        Our Peer Education program trains you to be a leader in public health. Gain skills, earn certification, and save lives.
                    </p>
                    <a href="/register" className="btn btn-primary" style={{ padding: '1.2rem 4rem', fontSize: '1.2rem', borderRadius: '20px', fontWeight: '800' }}>
                        Apply for Peer Educator Training
                    </a>
                </div>
            </div>
        </div >
    );
};

export default Awareness;

