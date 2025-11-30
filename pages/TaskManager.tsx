import React, { useEffect, useState } from 'react';
import { LucidePlus, LucidePlay, LucideSquare, LucideTrash2, LucideEdit, LucideEye, LucideRefreshCcw } from 'lucide-react';
import { CrawlerTask, TaskStatus } from '../types';
import { CrawlerService } from '../services/crawlerService';

interface TaskManagerProps {
    onEdit: (task: CrawlerTask) => void;
    onCreate: () => void;
    onViewResults: (taskId: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onEdit, onCreate, onViewResults }) => {
    const [tasks, setTasks] = useState<CrawlerTask[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        setLoading(true);
        const data = await CrawlerService.getTasks();
        setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleRun = async (id: string) => {
        await CrawlerService.runTask(id);
        loadTasks();
    };

    const handleStop = async (id: string) => {
        await CrawlerService.stopTask(id);
        loadTasks();
    };

    const handleDelete = async (id: string) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            await CrawlerService.deleteTask(id);
            loadTasks();
        }
    };

    const getStatusBadge = (status: TaskStatus) => {
        switch(status) {
            case TaskStatus.RUNNING: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 animate-pulse">Running</span>;
            case TaskStatus.COMPLETED: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completed</span>;
            case TaskStatus.FAILED: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">Failed</span>;
            case TaskStatus.STOPPED: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Stopped</span>;
            default: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">Idle</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Task Manager</h1>
                <div className="flex gap-3">
                     <button onClick={loadTasks} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <LucideRefreshCcw className="w-5 h-5" />
                    </button>
                    <button onClick={onCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                        <LucidePlus className="w-4 h-4" />
                        Create New Task
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-800/50 text-slate-200 uppercase font-medium border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Task Name</th>
                                <th className="px-6 py-4">Target URL</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Frequency</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4">Last Run</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Loading tasks...</td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No tasks found. Create one to get started.</td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{task.name}</td>
                                        <td className="px-6 py-4 truncate max-w-[200px]">{task.targetUrl}</td>
                                        <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                                        <td className="px-6 py-4">{task.frequency}</td>
                                        <td className="px-6 py-4 text-white font-mono">{task.itemsScraped || 0}</td>
                                        <td className="px-6 py-4">{task.lastRun ? new Date(task.lastRun).toLocaleString() : '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {task.status === TaskStatus.RUNNING ? (
                                                    <button onClick={() => handleStop(task.id)} className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg tooltip" title="Stop">
                                                        <LucideSquare className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleRun(task.id)} className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg" title="Run Now">
                                                        <LucidePlay className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => onViewResults(task.id)} className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg" title="View Data">
                                                    <LucideEye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => onEdit(task)} className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg" title="Edit">
                                                    <LucideEdit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(task.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg" title="Delete">
                                                    <LucideTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
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
