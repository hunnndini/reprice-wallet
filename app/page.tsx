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

  // Auto-connect logic - this is the new code!
  useEffect(() => {
    if (ready && !authenticated) {
      // Check if URL has connect parameter
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('connect') === 'true') {
        login(); // Automatically trigger Privy login
      }
    }
  }, [ready, authenticated, login]);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchBalance(user.wallet.address);
    }
  }, [authenticated, user]);

  if (!ready) return <div>Loading...</div>;

  // Check if this was triggered by the connect button
  const isPopupMode = new URLSearchParams(window.location.search).get('connect') === 'true';

  if (isPopupMode) {
    // Popup/Modal style
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Close button */}
          <button 
            onClick={() => window.history.back()}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>

          <h2 style={{ marginBottom: '24px', color: '#333' }}>Connect Your Wallet</h2>
          
          {!authenticated ? (
            <button 
              onClick={login}
              style={{
                backgroundColor: '#6366f1',
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
          ) : (
            <div>
              <p style={{ color: '#10b981', marginBottom: '16px' }}>✅ Wallet Connected!</p>
              <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all' }}>
                {user?.wallet?.address}
              </p>
              {balance && (
                <p style={{ margin: '16px 0', color: '#333' }}>
                  <strong>Balance:</strong> {balance} HYPE
                </p>
              )}
              <button 
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                Done
              </button>
            </div>
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