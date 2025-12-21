import React from 'react';


const Vision = () => {
    return (
        <div className="page-wrapper">
            <div className="about-hero">
                <div className="container">
                    <h1>Our Vision & Mission</h1>
                </div>
            </div>

            <div className="container mb-5">
                <div className="vision-mission-wrapper">
                    <div className="vm-content">
                        {/* Vision */}
                        <div style={{ backgroundColor: '#FFEBEE', borderLeft: '5px solid #D32F2F', padding: '2rem', marginBottom: '2rem', borderRadius: '4px' }}>
                            <h3 style={{ color: '#D32F2F', marginBottom: '1rem' }}>Vision</h3>
                            <p style={{ fontStyle: 'italic', color: '#555' }}>
                                "To see an HIV/AIDS-free university community where zero new infections, zero stigma, and zero AIDS-related deaths are a reality."
                            </p>
                        </div>

                        {/* Mission */}
                        <div style={{ backgroundColor: '#E3F2FD', borderLeft: '5px solid #1976D2', padding: '2rem', borderRadius: '4px' }}>
                            <h3 style={{ color: '#1976D2', marginBottom: '1rem' }}>Mission</h3>
                            <p style={{ fontStyle: 'italic', color: '#555' }}>
                                "To mobilize the university community through education, peer discussion, and advocacy to prevent the spread of HIV/AIDS and provide care and support for those affected."
                            </p>
                        </div>
                    </div>

                    <div className="vm-image">
                        <div style={{ position: 'relative', height: '400px', backgroundColor: '#ddd' }}>
                            {/* Placeholder for Doctor/Medical Image */}
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                                alt="Medical Professional"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem', color: 'white' }}>
                                <h3>Core Values</h3>
                                <p>Compassion • Integrity • Confidentiality • Inclusivity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Vision;
