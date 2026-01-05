import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: '#f8f9fa',
                    borderRadius: '16px',
                    margin: '2rem',
                    border: '1px solid #e9ecef'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ 
                        color: '#D32F2F', 
                        marginBottom: '1rem',
                        fontSize: '1.5rem',
                        fontWeight: '800'
                    }}>
                        Something went wrong
                    </h2>
                    <p style={{ 
                        color: '#666', 
                        marginBottom: '2rem',
                        fontSize: '1rem',
                        lineHeight: '1.6'
                    }}>
                        We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.8rem 2rem',
                                background: '#D32F2F',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Refresh Page
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            style={{
                                padding: '0.8rem 2rem',
                                background: 'transparent',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '25px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Go Back
                        </button>
                    </div>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ 
                            marginTop: '2rem', 
                            textAlign: 'left',
                            background: '#fff',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #ddd'
                        }}>
                            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '1rem' }}>
                                Error Details (Development)
                            </summary>
                            <pre style={{ 
                                fontSize: '0.8rem', 
                                color: '#D32F2F',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {this.state.error.toString()}
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;