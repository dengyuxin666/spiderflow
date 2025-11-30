import React, { useEffect, useState } from 'react';
import { LucideArrowLeft, LucideDownload, LucideSearch } from 'lucide-react';
import { CrawlerService } from '../services/crawlerService';
import { ScrapedItem } from '../types';

interface ResultViewerProps {
    taskId: string;
    onBack: () => void;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ taskId, onBack }) => {
    const [results, setResults] = useState<ScrapedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const data = await CrawlerService.getResults(taskId);
            setResults(data);
            setLoading(false);
        };
        fetchResults();
    }, [taskId]);

    // Gather all unique keys from all items to build table headers dynamically
    const allKeys = Array.from(new Set(results.flatMap(r => Object.keys(r.data))));

    const filteredResults = results.filter(r => 
        JSON.stringify(r.data).toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `task-${taskId}-results.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <LucideArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Task Results</h1>
                        <p className="text-slate-400 text-sm">Viewing {results.length} captured items</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search results..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:border-indigo-500 outline-none w-64"
                        />
                    </div>
                    <button onClick={downloadJSON} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <LucideDownload className="w-4 h-4" />
                        Export JSON
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="overflow-auto custom-scrollbar flex-1">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800 text-slate-200 font-medium uppercase sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-700 whitespace-nowrap bg-slate-800">Timestamp</th>
                                <th className="px-6 py-4 border-b border-slate-700 whitespace-nowrap bg-slate-800">Source URL</th>
                                {allKeys.map(key => (
                                    <th key={key} className="px-6 py-4 border-b border-slate-700 whitespace-nowrap bg-slate-800">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={allKeys.length + 2} className="px-6 py-12 text-center text-slate-500">Loading data...</td>
                                </tr>
                            ) : filteredResults.length === 0 ? (
                                <tr>
                                    <td colSpan={allKeys.length + 2} className="px-6 py-12 text-center text-slate-500">No data available.</td>
                                </tr>
                            ) : (
                                filteredResults.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">{new Date(item.timestamp).toLocaleTimeString()}</td>
                                        <td className="px-6 py-4 max-w-xs truncate text-indigo-400 hover:text-indigo-300 cursor-pointer" title={item.url}>
                                            {item.url}
                                        </td>
                                        {allKeys.map(key => (
                                            <td key={key} className="px-6 py-4 max-w-sm truncate text-slate-300" title={item.data[key]}>
                                                {/* Ensure we display raw text content, not Unicode escapes */}
                                                {item.data[key] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
