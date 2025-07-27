'use client';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

export default function Home() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [balance, setBalance] = useState<string | null>(null);

  const fetchBalance = async (address: string) => {
    const provider = new ethers.JsonRpcProvider('https://rpc.hyperliquid.xyz/evm');
    const rawBalance = await provider.getBalance(address);
    const formatted = ethers.formatEther(rawBalance);
    setBalance(formatted);
  };

  // Check if this was triggered by the connect button (only on client side)
  const [isPopupMode, setIsPopupMode] = useState(false);
  
  useEffect(() => {
    // This runs only on the client side
    const urlParams = new URLSearchParams(window.location.search);
    setIsPopupMode(urlParams.get('connect') === 'true');
  }, []);

  // Auto-connect logic - this is the new code!
  useEffect(() => {
    if (ready && !authenticated && isPopupMode) {
      // Check if URL has connect parameter
      login(); // Automatically trigger Privy login
    }
  }, [ready, authenticated, login, isPopupMode]);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchBalance(user.wallet.address);
    }
  }, [authenticated, user]);

  if (!ready) return <div>Loading...</div>;

  if (isPopupMode) {
    // Show the login interface in popup mode
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center'
        }}>
          {!authenticated ? (
            <>
              <h2 style={{ marginBottom: '1rem', color: '#333' }}>Connect Your Wallet</h2>
              <button 
                onClick={login}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Connect Wallet
              </button>
            </>
          ) : (
            <>
              <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>✅ Wallet Connected!</h2>
              <p style={{ marginBottom: '1rem', wordBreak: 'break-all' }}>
                <strong>Address:</strong><br />
                {user?.wallet?.address}
              </p>
              {balance && (
                <p style={{ marginBottom: '1rem' }}>
                  <strong>HYPE Balance:</strong> {balance}
                </p>
              )}
              <button 
                onClick={logout}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Regular page view (when not in popup mode)
  return (
    <main style={{ padding: 32 }}>
      <h1>✨ Privy Wallet App</h1>
      {!authenticated ? (
        <button onClick={login}>Log In</button>
      ) : (
        <>
          <p>You are logged in! 🎉</p>
          <button onClick={logout}>Log Out</button>
          <p><strong>Wallet Address:</strong><br />{user?.wallet?.address}</p>
          {balance && (
            <p><strong>HYPE Balance:</strong> {balance}</p>
          )}
        </>
      )}
    </main>
  );
}