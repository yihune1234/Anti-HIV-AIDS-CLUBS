import React from 'react';


const About = () => {
    return (
        <div className="page-wrapper">
            <div className="about-hero">
                <div className="container">
                    <h1>About Our Club</h1>
                    <p className="text-muted">Learn about our history and role at Haramaya University.</p>
                </div>
            </div>

            <div className="container mb-5">
                {/* Club Background */}
                <div className="card mb-4" style={{ borderTop: '4px solid #D32F2F' }}>
                    <h3>Club Background</h3>
                    <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid #eee' }} />
                    <p className="text-muted">
                        The Haramaya University Anti-HIV/AIDS Club was established to combat the spread of HIV/AIDS within the university community and surrounding areas.
                        We operate under the Student Union and the University's HIV/AIDS Prevention and Control Directorate.
                    </p>
                    <p className="text-muted mt-2">
                        Our club is student-led and faculty-supported, ensuring that our initiatives are relevant, engaging, and effective for the youth demographic.
                    </p>
                </div>

                <div className="row" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {/* Objectives */}
                    <div className="card" style={{ flex: 1, minWidth: '300px', borderTop: '4px solid #D32F2F' }}>
                        <h3>Objectives</h3>
                        <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid #eee' }} />
                        <ul style={{ paddingLeft: '1.2rem', color: '#666', lineHeight: '1.8' }}>
                            <li>Reduce new HIV infections among students.</li>
                            <li>Eliminate stigma and discrimination against PLWHA.</li>
                            <li>Promote voluntary counseling and testing (VCT).</li>
                            <li>Empower female students in reproductive health.</li>
                        </ul>
                    </div>

                    {/* Target Audience */}
                    <div className="card" style={{ flex: 1, minWidth: '300px', borderTop: '4px solid #D32F2F' }}>
                        <h3>Target Audience</h3>
                        <hr style={{ margin: '1rem 0', border: '0', borderTop: '1px solid #eee' }} />
                        <ul style={{ paddingLeft: '1.2rem', color: '#666', lineHeight: '1.8' }}>
                            <li>Undergraduate and postgraduate students.</li>
                            <li>Academic and administrative staff.</li>
                            <li>Local community members in Haramaya town.</li>
                            <li>High school students in the vicinity.</li>
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default About;
