'use client'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const hasSentInitial = useRef(false)

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return

    const sendPageView = (url: string) => {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        page_title: typeof document !== 'undefined' ? document.title : '',
      })
    }

    if (!hasSentInitial.current) {
      hasSentInitial.current = true
      sendPageView(pathname || '/')
    } else {
      sendPageView(pathname || '/')
    }
  }, [pathname])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: false
          });
        `}
      </Script>
    </>
  )
}
