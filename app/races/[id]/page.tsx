import { notFound } from 'next/navigation'
import RaceDetailClient from './RaceDetailClient'
import { getRacesFromGoogleSheets } from '@/lib/google-sheets'
import type { Metadata } from 'next'

export const runtime = 'edge'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agendabiker.com'

async function getRace(id: string) {
  const sheetUrl = process.env.GOOGLE_SHEET_URL
  if (!sheetUrl) return null
  const races = await getRacesFromGoogleSheets(sheetUrl)
  return races.find((r) => String(r.id) === id || r.id === Number(id)) ?? null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const race = await getRace(params.id)
  if (!race) return { title: 'Carrera no encontrada' }
  const location = [race.city, race.province, race.country].filter(Boolean).join(', ')
  const description =
    race.description?.trim().slice(0, 155) ||
    `Carrera ${race.name}${location ? ` en ${location}` : ''}. ${race.discipline}${race.format ? ` | ${race.format}` : ''}. Fecha: ${race.startDate}.`
  return {
    title: race.name,
    description,
    openGraph: {
      title: race.name,
      description,
      url: `${siteUrl}/races/${params.id}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: race.name, description },
    alternates: { canonical: `${siteUrl}/races/${params.id}` },
  }
}

function buildEventJsonLd(race: {
  id: number
  name: string
  startDate: string
  endDate?: string
  location?: string
  city?: string
  province?: string
  country?: string
  description?: string
  registrationUrl?: string
  website?: string
}) {
  const location = [race.city, race.province, race.country].filter(Boolean).join(', ') || race.location
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: race.name,
    startDate: race.startDate,
    ...(race.endDate && { endDate: race.endDate }),
    ...(location && {
      location: {
        '@type': 'Place',
        name: location,
      },
    }),
    ...(race.description?.trim() && { description: race.description.trim().slice(0, 500) }),
    url: `${siteUrl}/races/${race.id}`,
    ...(race.registrationUrl && { offers: { '@type': 'Offer', url: race.registrationUrl } }),
  }
}

export default async function RaceDetailPage({ params }: { params: { id: string } }) {
  const race = await getRace(params.id)
  if (!race) notFound()

  const jsonLd = buildEventJsonLd(race)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RaceDetailClient raceId={params.id} />
    </>
  )
}
