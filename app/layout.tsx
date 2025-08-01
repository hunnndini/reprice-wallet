import Providers from './providers'

export const metadata = {
  title: 'Privy Wallet App',
  description: 'Using Privy with App Router'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
