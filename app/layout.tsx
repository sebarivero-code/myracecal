import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MyRaceCal.app',
  description: 'Calendario de carreras de ciclismo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

