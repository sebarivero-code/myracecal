import { MetadataRoute } from 'next'
import { getRacesFromGoogleSheets } from '@/lib/google-sheets'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agendabiker.com'

/** Cache del sitemap 1 hora para que Google y los usuarios reciban respuesta rápida */
export const revalidate = 3600

/** Timeout en ms para no bloquear la respuesta si Sheets tarda */
const SHEETS_TIMEOUT_MS = 8000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Sitemap: timeout obteniendo carreras')), ms)
    ),
  ])
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/races`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/races/filters`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  const sheetUrl = process.env.GOOGLE_SHEET_URL
  if (!sheetUrl) return base

  try {
    const races = await withTimeout(getRacesFromGoogleSheets(sheetUrl), SHEETS_TIMEOUT_MS)
    const raceEntries: MetadataRoute.Sitemap = races.map((race) => ({
      url: `${siteUrl}/races/${race.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    return [...base, ...raceEntries]
  } catch {
    return base
  }
}
