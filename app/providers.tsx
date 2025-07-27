'use client';
import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        appearance: {
          theme: 'dark', // or 'light'
          accentColor: '#007bff', // Your brand color
          logo: 'https://your-logo-url.com/logo.png', // Optional: your logo
          showWalletLoginFirst: true,
          walletList: ['metamask', 'coinbase_wallet', 'rabby_wallet', 'wallet_connect'], // Limit which wallets show
        },
        defaultChain: {
          id: 999,
          name: 'Hyperliquid EVM',
          nativeCurrency: {
            name: 'HYPE',
            symbol: 'HYPE',
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ['https://rpc.hyperliquid.xyz/evm'],
            },
          },
        },
        supportedChains: [
          {
            id: 999,
            rpcUrls: {
              default: {
                http: ['https://rpc.hyperliquid.xyz/evm'],
              },
            },
            name: 'Hyperliquid EVM',
            nativeCurrency: {
              name: 'HYPE',
              symbol: 'HYPE',
              decimals: 18,
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
}