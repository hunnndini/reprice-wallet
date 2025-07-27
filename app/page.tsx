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

  if (!ready) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      ...styles.container,
      backgroundColor: isPopupMode ? 'rgba(0, 0, 0, 0.8)' : styles.container.backgroundColor
    }}>
      {!authenticated ? (
        <button onClick={login} style={styles.loginButton}>
          Log In
        </button>
      ) : (
        <div style={styles.walletInfo}>
          <div style={styles.welcomeText}>✨ Connected!</div>
          <div style={styles.address}>{user?.wallet?.address}</div>
          {balance && (
            <div style={styles.balance}>Balance: {balance} HYPE</div>
          )}
          <button onClick={logout} style={styles.logoutButton}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    backdropFilter: 'blur(10px)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    color: '#000000',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    minWidth: '160px',
  } as React.CSSProperties,
  walletInfo: {
    textAlign: 'center' as const,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '32px',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  welcomeText: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  address: {
    fontSize: '14px',
    opacity: 0.8,
    marginBottom: '12px',
    wordBreak: 'break-all' as const,
  },
  balance: {
    fontSize: '16px',
    marginBottom: '24px',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  loadingText: {
    color: '#ffffff',
    fontSize: '18px',
  },
};

// Add hover effects with a style tag
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
    }

    button:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);
}
