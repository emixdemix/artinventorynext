import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from './client-providers'
import { ThemeProvider, themeInitScript } from '@/theme/ThemeProvider'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ClientProviders>
            <section className="mainContainer">
              {children}
            </section>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
