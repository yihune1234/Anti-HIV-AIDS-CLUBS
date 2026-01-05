import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
    const sizeStyles = {
        small: { width: '20px', height: '20px', fontSize: '0.8rem' },
        medium: { width: '40px', height: '40px', fontSize: '1rem' },
        large: { width: '60px', height: '60px', fontSize: '1.2rem' }
    };

    const spinnerSize = sizeStyles[size];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1rem'
        }}>
            <div
                style={{
                    width: spinnerSize.width,
                    height: spinnerSize.height,
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #D32F2F',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <p style={{
                margin: 0,
                color: '#666',
                fontSize: spinnerSize.fontSize,
                fontWeight: '500'
            }}>
                {message}
            </p>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default LoadingSpinner;