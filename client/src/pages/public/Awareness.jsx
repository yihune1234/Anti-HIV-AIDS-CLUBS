import React from 'react';


const Awareness = () => {
    return (
        <div className="page-wrapper">
            <div className="about-hero">
                <div className="container">
                    <h1>HIV/AIDS Awareness</h1>
                    <p className="text-muted">Accurate information is the first step towards prevention.</p>
                </div>
            </div>

            <div className="container mb-5">
                <div className="awareness-grid">
                    {/* The Basics - Red */}
                    <div className="awareness-card">
                        <div className="ac-header red">
                            <span>ℹ️</span> The Basics
                        </div>
                        <div className="ac-body">
                            <p className="text-muted mb-4">
                                HIV (Human Immunodeficiency Virus) attacks the body's immune system. If not treated, it can lead to AIDS (Acquired Immunodeficiency Syndrome).
                            </p>
                            <h4 style={{ fontSize: '1rem', color: '#333' }}>Transmission Modes:</h4>
                            <ul style={{ paddingLeft: '1.2rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                <li>Unprotected sexual intercourse</li>
                                <li>Sharing needles or syringes</li>
                                <li>Mother to child during pregnancy/birth</li>
                                <li>Contact with infected blood</li>
                            </ul>
                        </div>
                    </div>

                    {/* Prevention - Blue */}
                    <div className="awareness-card">
                        <div className="ac-header blue">
                            <span>🛡️</span> Prevention
                        </div>
                        <div className="ac-body">
                            <p className="text-muted mb-4">
                                HIV is preventable. Taking proactive steps protects you and your partner.
                            </p>
                            <h4 style={{ fontSize: '1rem', color: '#333' }}>Key Strategies:</h4>
                            <ul style={{ paddingLeft: '1.2rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                <li>Abstinence or mutual faithfulness</li>
                                <li>Correct and consistent condom use</li>
                                <li>Never sharing sharp materials</li>
                                <li>Pre-exposure prophylaxis (PrEP)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Myths vs Facts - Green */}
                    <div className="awareness-card">
                        <div className="ac-header green">
                            <span>✔️</span> Myths vs. Facts
                        </div>
                        <div className="ac-body">
                            <div className="mb-3">
                                <p style={{ color: '#D32F2F', fontSize: '0.9rem', margin: 0 }}>❌ Myth: You can get HIV from hugging.</p>
                                <p style={{ color: '#43A047', fontSize: '0.9rem', margin: 0 }}>✔️ Fact: HIV is not spread through touch, sweat, or saliva.</p>
                            </div>
                            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '1rem 0' }} />
                            <div>
                                <p style={{ color: '#D32F2F', fontSize: '0.9rem', margin: 0 }}>❌ Myth: HIV is a death sentence.</p>
                                <p style={{ color: '#43A047', fontSize: '0.9rem', margin: 0 }}>✔️ Fact: With ART medication, people with HIV live long, healthy lives.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="mt-5 p-5 text-center" style={{ backgroundColor: '#F5F5F5', borderRadius: '8px' }}>
                    <h3>Need Testing or Counseling?</h3>
                    <p className="text-muted">The University Clinic offers free and confidential VCT services.</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '20px', marginTop: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <span style={{ color: '#D32F2F' }}>📍</span>
                        <strong>Student Clinic, Building B, Room 104</strong>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Awareness;
