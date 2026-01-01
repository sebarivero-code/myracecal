import RaceDetailClient from './RaceDetailClient'

export const runtime = 'edge'

export default function RaceDetailPage({ params }: { params: { id: string } }) {
  return <RaceDetailClient raceId={params.id} />
}
