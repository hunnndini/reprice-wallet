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

  // Check if running in an iframe (embedded)
  const isEmbedded = window !== window.parent;

  // Auto-connect logic when embedded
  useEffect(() => {
    if (ready && !authenticated && isEmbedded) {
      // Auto-trigger login when embedded
      login();
    }
  }, [ready, authenticated, login, isEmbedded]);

  // Listen for messages from parent window (Framer)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'connectWallet') {
        login();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchBalance(user.wallet.address);
    }
  }, [authenticated, user]);

  if (!ready) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: isEmbedded ? '300px' : '100vh',
      background: isEmbedded ? 'transparent' : 'white'
    }}>
      Loading...
    </div>
  );

  if (isEmbedded) {
    // Embedded view - clean and minimal
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        margin: '16px',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {!authenticated ? (
          <div>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Connect Your Wallet</h3>
            <button 
              onClick={login}
              style={{
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ color: '#10b981', marginBottom: '16px' }}>Wallet Connected!</h3>
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              wordBreak: 'break-all',
              marginBottom: '16px',
              padding: '8px',
              background: '#f3f4f6',
              borderRadius: '6px'
            }}>
              {user?.wallet?.address}
            </p>
            {balance && (
              <p style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>
                Balance: {balance} HYPE
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular page view (when not embedded)
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