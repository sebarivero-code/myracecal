'use client'

import { useEffect } from 'react'
import RaceDetailClient from '@/app/races/[id]/RaceDetailClient'

export default function RaceDetailModal({ raceId, title, onClose }: { raceId: string; title?: string; onClose: () => void }) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal
      role="dialog"
      aria-labelledby={title ? 'race-detail-title' : undefined}
    >
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar"
      />
      {/* Panel angosto */}
      <div
        className="relative w-full max-w-md max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal: logo + nombre de la carrera + cerrar (misma tonalidad oscura que el logo) */}
        {title && (
          <div id="race-detail-title" className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-gray-950">
            <img src="/logo-solo.png" alt="" className="h-9 w-9 object-contain flex-shrink-0" aria-hidden />
            <h2 className="text-base font-bold text-white truncate flex-1 min-w-0">{title}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-800 text-gray-200 flex-shrink-0" aria-label="Cerrar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <RaceDetailClient raceId={raceId} embedded onClose={onClose} hideCloseButton={!!title} />
      </div>
    </div>
  )
}
