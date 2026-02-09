import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendario de carreras',
  description:
    'Listado de carreras de MTB, XCO, XCM, rally y gravel. Filtros por provincia, disciplina, formato, modalidad y campeonato. Fechas e inscripción.',
  openGraph: {
    title: 'Calendario de carreras MTB y ciclismo | Agenda Biker',
    description: 'Listado de carreras con filtros por provincia, disciplina y campeonato. Fechas e inscripción.',
  },
}

export default function RacesLayout({ children }: { children: React.ReactNode }) {
  return children
}
