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

  // Check if running in an iframe (embedded)
  const isEmbedded = window !== window.parent;

  return (
    <main style={{ padding: 32, background: isEmbedded ? 'transparent' : 'white' }}>
      {/* Hide title and content when embedded, just show login */}
      {!isEmbedded && <h1>✨ Privy Wallet App</h1>}
      
      {!authenticated ? (
        <div style={{ textAlign: 'center' }}>
          {!isEmbedded && <button onClick={login}>Log In</button>}
          {/* Auto-trigger login when embedded */}
          {isEmbedded && <div style={{ display: 'none' }}></div>}
        </div>
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