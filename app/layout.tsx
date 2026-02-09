import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agendabiker.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Agenda Biker – Calendario de carreras MTB y ciclismo',
    template: '%s | Agenda Biker',
  },
  description: 'Calendario de carreras de MTB, XCO, XCM, rally y gravel. Fechas, ubicaciones, inscripción y filtros por provincia, disciplina y campeonato.',
  keywords: ['carreras MTB', 'calendario ciclismo', 'carreras bicicleta', 'MTB Argentina', 'XCO', 'XCM', 'rally', 'gravel'],
  authors: [{ name: 'Agenda Biker' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteUrl,
    siteName: 'Agenda Biker',
    title: 'Agenda Biker – Calendario de carreras MTB y ciclismo',
    description: 'Calendario de carreras de MTB, XCO, XCM, rally y gravel. Fechas, ubicaciones e inscripción.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agenda Biker – Calendario de carreras MTB',
    description: 'Calendario de carreras de MTB y ciclismo. Fechas, ubicaciones y filtros.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
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

