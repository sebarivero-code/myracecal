import { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agendabiker.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/races/manage/', '/races/new/', '/races/my-calendar/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
