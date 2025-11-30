import React from 'react';
import { LucideActivity, LucideDatabase, LucideServer, LucideClock } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', items: 4000 },
  { name: 'Tue', items: 3000 },
  { name: 'Wed', items: 2000 },
  { name: 'Thu', items: 2780 },
  { name: 'Fri', items: 1890 },
  { name: 'Sat', items: 2390 },
  { name: 'Sun', items: 3490 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 mt-2">Overview of your crawler infrastructure.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Crawlers" value="12" icon={LucideActivity} trend="+2" color="emerald" />
        <StatCard title="Pages Scraped" value="1.2M" icon={LucideDatabase} trend="+15%" color="indigo" />
        <StatCard title="Server Load" value="45%" icon={LucideServer} color="amber" />
        <StatCard title="Avg. Response" value="230ms" icon={LucideClock} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Scraping Activity (Last 7 Days)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                        <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#818cf8' }}
                        />
                        <Bar dataKey="items" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-4">
                {[
                    { label: 'Proxy Pool Availability', val: 98, color: 'bg-emerald-500' },
                    { label: 'CPU Usage', val: 45, color: 'bg-indigo-500' },
                    { label: 'Memory Usage', val: 62, color: 'bg-amber-500' },
                    { label: 'Storage Usage', val: 24, color: 'bg-purple-500' },
                ].map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">{item.label}</span>
                            <span className="text-white font-medium">{item.val}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
