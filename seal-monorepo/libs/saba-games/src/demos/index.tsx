import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import FishPrawnCrabAnimationDemo from './fish-prawn-crab-animation/fish-prawn-crab-animation-demo';
import styles from './demos.module.scss';

// Home component for the demos section
const DemoHome = () => {
    return (
        <div className={styles.demoHome}>
            <h2>Welcome to Game Demos</h2>
            <p>Please select a demo from the navigation menu above.</p>

            <div className={styles.demoList}>
                <div className={styles.demoCard}>
                    <h3>Fish-Prawn-Crab Animation</h3>
                    <p>
                        Interactive demo of the Fish-Prawn-Crab game animations and settlement results.
                        Shows how different dice combinations trigger different animations.
                    </p>
                    <Link to="/fpc-animation" className={styles.demoButton}>
                        View Demo
                    </Link>
                </div>

                {/* Add more demo cards here as needed */}
            </div>
        </div>
    );
};

// Main component for the demos section
const Demos = () => {
    return (
        <div className={styles.demosContainer}>
            <header className={styles.demosHeader}>
                <h1>Game Demos</h1>
                <nav className={styles.demosNav}>
                    <ul>
                        <li>
                            <Link to="/demos">Home</Link>
                        </li>
                        <li>
                            <Link to="/fpc-animation">Fish-Prawn-Crab Animation</Link>
                        </li>
                        {/* Add more demo links here as needed */}
                    </ul>
                </nav>
            </header>

            <div className={styles.demosContent}>
                <Routes>
                    <Route path="/" element={<DemoHome />} />
                    {/* Other nested routes can be added here if needed */}
                </Routes>
            </div>
        </div>
    );
};

export default Demos; 