import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div style={styles.layout}>
            <Navbar />
            <main style={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        flex: 1,
        padding: '2rem 0',
    }
};

export default MainLayout;
