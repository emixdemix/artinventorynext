import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from './client-providers'

export const metadata: Metadata = {
  title: 'Artinventory!',
  description: 'Manage and organize your art work',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <section className="mainContainer">
            {children}
          </section>
        </ClientProviders>
      </body>
    </html>
  )
}
