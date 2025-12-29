import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSettingsModal = ({ isOpen, onClose }) => {
    const { theme, updateTheme } = useTheme();

    if (!isOpen) return null;

    const colors = [
        { name: 'Classic Red', value: '#D32F2F' },
        { name: 'Royal Blue', value: '#1976D2' },
        { name: 'Forest Green', value: '#388E3C' },
        { name: 'Deep Purple', value: '#7B1FA2' },
        { name: 'Midnight', value: '#1e1e2f' },
        { name: 'Ocean', value: '#0ea5e9' },
        { name: 'Amber', value: '#f59e0b' },
        { name: 'Rose', value: '#e11d48' }
    ];

    const sidebarThemes = [
        { name: 'Professional Dark', value: 'dark', bg: '#111827' },
        { name: 'Clean Light', value: 'light', bg: '#ffffff' }
    ];

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Personalize Your Experience</h2>
                    <button onClick={onClose} style={closeButtonStyle}>✕</button>
                </div>

                <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Primary Brand Color</h3>
                    <div style={gridStyle}>
                        {colors.map(color => (
                            <button
                                key={color.value}
                                onClick={() => updateTheme({ primaryColor: color.value, accentColor: color.value })}
                                style={{
                                    ...colorButtonStyle,
                                    backgroundColor: color.value,
                                    border: theme.primaryColor === color.value ? '3px solid #fff' : 'none',
                                    boxShadow: theme.primaryColor === color.value ? '0 0 0 2px ' + color.value : 'none'
                                }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Sidebar Theme</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {sidebarThemes.map(t => (
                            <button
                                key={t.value}
                                onClick={() => updateTheme({ sidebarTheme: t.value })}
                                style={{
                                    ...themeToggleStyle,
                                    backgroundColor: t.bg,
                                    color: t.value === 'dark' ? 'white' : '#333',
                                    border: theme.sidebarTheme === t.value ? `2px solid ${theme.primaryColor}` : '1px solid #ddd'
                                }}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={sectionStyle}>
                    <h3 style={sectionTitleStyle}>Header Visuals</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['gradient', 'solid'].map(style => (
                            <button
                                key={style}
                                onClick={() => updateTheme({ headerStyle: style })}
                                style={{
                                    ...themeToggleStyle,
                                    textTransform: 'capitalize',
                                    border: theme.headerStyle === style ? `2px solid ${theme.primaryColor}` : '1px solid #ddd'
                                }}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button onClick={onClose} style={{ ...saveButtonStyle, backgroundColor: theme.primaryColor }}>
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
};

const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    animation: 'modalSlideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
};

const sectionStyle = {
    marginBottom: '1.5rem'
};

const sectionTitleStyle = {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
};

const colorButtonStyle = {
    height: '45px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
};

const themeToggleStyle = {
    flex: 1,
    padding: '0.8rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    border: 'none'
};

const closeButtonStyle = {
    background: '#f8f9fa',
    border: 'none',
    color: '#666',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
};

const saveButtonStyle = {
    color: 'white',
    border: 'none',
    padding: '1rem 3rem',
    borderRadius: '50px',
    fontWeight: '800',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.2s'
};

export default ThemeSettingsModal;
