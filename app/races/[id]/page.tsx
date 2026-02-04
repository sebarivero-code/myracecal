import RaceDetailClient from './RaceDetailClient'

// Removido runtime = 'edge' porque el componente cliente necesita Node.js runtime
export const runtime = 'nodejs'

export default function RaceDetailPage({ params }: { params: { id: string } }) {
  return <RaceDetailClient raceId={params.id} />
}
