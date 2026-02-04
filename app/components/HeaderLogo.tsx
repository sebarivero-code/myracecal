'use client'

import { useState } from 'react'

/** Naranja de marca AgendaBiker */
export const BRAND_ORANGE = '#E85D04'
export const BRAND_ORANGE_HOVER = '#C24A03'

interface HeaderLogoProps {
  year?: number
  className?: string
  /** Si false, no muestra el año (para layout con logo izq y año der) */
  showYear?: boolean
}

export default function HeaderLogo({ year, className = '', showYear = true }: HeaderLogoProps) {
  const [iconError, setIconError] = useState(false)
  const displayYear = year ?? new Date().getFullYear()

  return (
    <div className={`flex items-center gap-2 flex-shrink-0 ${className}`}>
      {!iconError && (
        <img
          src="/logo-solo.png"
          alt=""
          className="h-11 w-11 object-contain flex-shrink-0"
          aria-hidden
          onError={() => setIconError(true)}
        />
      )}
      <div className="flex flex-col items-start">
        <span className="text-base font-bold italic leading-tight">
          <span style={{ color: BRAND_ORANGE }}>Agenda</span>
          <span className="text-white">Biker</span>
        </span>
        <span className="text-[10px] font-normal not-italic text-gray-400 whitespace-nowrap">
          Tu calendario de carreras MTB
        </span>
      </div>
      {showYear && (
        <span
          className="text-base font-bold italic whitespace-nowrap ml-[10px]"
          style={{ color: BRAND_ORANGE }}
        >
          {displayYear}
        </span>
      )}
    </div>
  )
}
