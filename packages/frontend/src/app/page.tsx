import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          AtlasOS
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          AI-native data operating system for autonomous agents
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Universal Ingestion</h3>
            <p className="text-slate-400">Connect any data source - databases, APIs, cloud storage, and more</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Agent-Native</h3>
            <p className="text-slate-400">Built for autonomous agents to reason over and serve enterprise data</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-2">Enterprise Ready</h3>
            <p className="text-slate-400">Security, governance, and compliance built from day one</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Go to Dashboard
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
            Documentation
          </Button>
        </div>

        <div className="mt-16 text-slate-400 text-sm">
          <p>Phase 1 MVP - June 2026</p>
        </div>
      </div>
    </main>
  );
}
