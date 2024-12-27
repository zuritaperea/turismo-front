// Splash.js
import React from 'react';
import logomark from "../assets/img/logomark.png";

function Splash() {
    return (
        <div className="splash">
            <div className="splash-container">
                <img className="logo-splash" src={logomark} alt="Logo" />
            </div>
        </div>
    );
};

export default Splash;
