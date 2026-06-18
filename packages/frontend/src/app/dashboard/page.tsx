export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm font-bold">A</div>
            <h1 className="text-xl font-bold">AtlasOS</h1>
          </div>
          <nav className="flex gap-6">
            <a href="#" className="text-slate-300 hover:text-white">Projects</a>
            <a href="#" className="text-slate-300 hover:text-white">Connectors</a>
            <a href="#" className="text-slate-300 hover:text-white">Agents</a>
            <a href="#" className="text-slate-300 hover:text-white">Settings</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium">Connectors</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium">Datasets</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium">Pipelines</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm font-medium">Agents Running</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="text-slate-400 text-center py-12">
              <p>No recent activity</p>
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
                New Connector
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
                New Pipeline
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
                Deploy Agent
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
