export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">☀️ Celaris - Solar Energy Solutions</h1>
      <p className="text-xl text-gray-600 mb-8">Sustainable energy for a better future</p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Get Started
        </button>
        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
          Learn More
        </button>
      </div>
    </main>
  );
}
