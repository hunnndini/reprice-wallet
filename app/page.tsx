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
    // Popup/Modal style - clean overlay with no background content
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Blurry white overlay
        backdropFilter: 'blur(10px)', // Blur effect
        WebkitBackdropFilter: 'blur(10px)', // Safari support
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        {/* Just the Privy popup will appear here, no other content */}
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