'use client'

export default function LoadingAnimation({ size = 200 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="/loading.gif" 
        alt="Cargando..." 
        style={{ width: size, height: size }}
        className="object-contain"
      />
    </div>
  )
}
