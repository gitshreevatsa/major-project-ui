import React, { useState } from 'react';
import './LandingPage.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'

const Landingpage = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const navigate = useNavigate();
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const wallet = accounts[0];
            setWalletAddress(wallet);
            setIsWalletConnected(true); // Set wallet connection status to true
            console.log(wallet)
            console.log(walletAddress)
            console.log(isWalletConnected)
            localStorage.setItem('WalletAddress', wallet)
            navigate('/filemanager')
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    return (
        <div className="app-container">
            <h1>Secure Files Safely with SeFi Safe</h1>
            <div className="connect-wallet-btn">
                <button onClick={connectWallet}>
                    Connect Wallet
                </button>
            </div>
        </div>

    );
};

export default Landingpage;
