import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'Agenda Biker',
  description: 'Tu calendario de carreras MTB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}

