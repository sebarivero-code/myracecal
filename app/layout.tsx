import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}

