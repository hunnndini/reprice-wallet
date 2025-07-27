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
