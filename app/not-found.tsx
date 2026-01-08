export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">404</h2>
        <p className="text-gray-600 mb-4">Esta página no existe</p>
        <a
          href="/races"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
        >
          Volver a carreras
        </a>
      </div>
    </div>
  )
}
