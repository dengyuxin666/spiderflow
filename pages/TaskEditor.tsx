import React, { useState, useEffect } from 'react';
import { LucideArrowLeft, LucidePlus, LucideTrash, LucideSave, LucideHelpCircle } from 'lucide-react';
import { CrawlerTask, TaskStatus, DepthConfig, ScrapeRule, RuleType } from '../types';
import { CrawlerService } from '../services/crawlerService';
import { FREQUENCIES } from '../constants';

interface TaskEditorProps {
    task?: CrawlerTask;
    onClose: () => void;
}

export const TaskEditor: React.FC<TaskEditorProps> = ({ task, onClose }) => {
    const [formData, setFormData] = useState<Partial<CrawlerTask>>({
        name: '',
        targetUrl: '',
        maxDepth: 1,
        frequency: 'Daily',
        status: TaskStatus.IDLE,
        startTime: new Date().toISOString().slice(0, 16),
        depthConfigs: []
    });

    useEffect(() => {
        if (task) {
            setFormData(JSON.parse(JSON.stringify(task))); // Deep copy
        } else {
            // Initialize default depth configs
            setFormData(prev => ({
                ...prev,
                depthConfigs: [{ depth: 1, rules: [] }]
            }));
        }
    }, [task]);

    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDepthChange = (newMaxDepth: number) => {
        const currentConfigs = [...(formData.depthConfigs || [])];
        
        // Add new levels if increased
        if (newMaxDepth > currentConfigs.length) {
            for (let i = currentConfigs.length + 1; i <= newMaxDepth; i++) {
                currentConfigs.push({ depth: i, rules: [] });
            }
        } 
        // Remove levels if decreased
        else if (newMaxDepth < currentConfigs.length) {
            currentConfigs.splice(newMaxDepth);
        }

        setFormData(prev => ({
            ...prev,
            maxDepth: newMaxDepth,
            depthConfigs: currentConfigs
        }));
    };

    const addRule = (depthIndex: number) => {
        const newConfigs = [...(formData.depthConfigs || [])];
        newConfigs[depthIndex].rules.push({
            id: Date.now().toString(),
            name: '',
            selector: '',
            type: RuleType.TEXT
        });
        setFormData(prev => ({ ...prev, depthConfigs: newConfigs }));
    };

    const removeRule = (depthIndex: number, ruleIndex: number) => {
        const newConfigs = [...(formData.depthConfigs || [])];
        newConfigs[depthIndex].rules.splice(ruleIndex, 1);
        setFormData(prev => ({ ...prev, depthConfigs: newConfigs }));
    };

    const updateRule = (depthIndex: number, ruleIndex: number, field: keyof ScrapeRule, value: string) => {
        const newConfigs = [...(formData.depthConfigs || [])];
        // @ts-ignore
        newConfigs[depthIndex].rules[ruleIndex][field] = value;
        setFormData(prev => ({ ...prev, depthConfigs: newConfigs }));
    };

    const handleSave = async () => {
        if (!formData.name || !formData.targetUrl) {
            alert('Please fill in required fields');
            return;
        }

        const newTask: CrawlerTask = {
            id: task?.id || Date.now().toString(),
            name: formData.name!,
            targetUrl: formData.targetUrl!,
            maxDepth: Number(formData.maxDepth),
            frequency: formData.frequency!,
            startTime: formData.startTime!,
            status: formData.status || TaskStatus.IDLE,
            depthConfigs: formData.depthConfigs || [],
            lastRun: task?.lastRun,
            itemsScraped: task?.itemsScraped
        };

        await CrawlerService.saveTask(newTask);
        onClose();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <LucideArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-white">{task ? 'Edit Task' : 'Create New Task'}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Basic Configuration</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Task Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleBasicChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="e.g. Amazon Product Crawler"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Target URL</label>
                            <input 
                                type="url" 
                                name="targetUrl" 
                                value={formData.targetUrl} 
                                onChange={handleBasicChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Schedule Frequency</label>
                            <select 
                                name="frequency" 
                                value={formData.frequency} 
                                onChange={handleBasicChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            >
                                {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Start Time</label>
                            <input 
                                type="datetime-local" 
                                name="startTime" 
                                value={formData.startTime} 
                                onChange={handleBasicChange}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Crawl Depth</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="5" 
                                    value={formData.maxDepth} 
                                    onChange={(e) => handleDepthChange(Number(e.target.value))}
                                    className="flex-1 accent-indigo-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-white font-mono font-bold">{formData.maxDepth}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Level 1 is the target URL. Level 2 follows links found on Level 1, etc.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Rules Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-white">Scraping Rules</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <LucideHelpCircle className="w-4 h-4" />
                                <span>Define what to extract at each depth level</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {formData.depthConfigs?.map((config, depthIndex) => (
                                <div key={config.depth} className="border border-slate-700 rounded-lg overflow-hidden">
                                    <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                                        <h3 className="font-medium text-indigo-400">Depth Level {config.depth}</h3>
                                        <button 
                                            onClick={() => addRule(depthIndex)}
                                            className="text-xs flex items-center gap-1 bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-600/30 transition-colors"
                                        >
                                            <LucidePlus className="w-3 h-3" /> Add Rule
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-3 bg-slate-900/50">
                                        {config.rules.length === 0 ? (
                                            <p className="text-sm text-slate-600 italic">No rules defined. Nothing will be scraped at this level.</p>
                                        ) : (
                                            config.rules.map((rule, ruleIndex) => (
                                                <div key={rule.id} className="grid grid-cols-12 gap-2 items-start bg-slate-800 p-3 rounded-md">
                                                    <div className="col-span-3">
                                                        <label className="text-xs text-slate-500 block mb-1">Field Name</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="e.g. Title"
                                                            value={rule.name}
                                                            onChange={(e) => updateRule(depthIndex, ruleIndex, 'name', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="col-span-4">
                                                        <label className="text-xs text-slate-500 block mb-1">CSS Selector</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder=".product-title"
                                                            value={rule.selector}
                                                            onChange={(e) => updateRule(depthIndex, ruleIndex, 'selector', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none font-mono"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-xs text-slate-500 block mb-1">Type</label>
                                                        <select 
                                                            value={rule.type}
                                                            onChange={(e) => updateRule(depthIndex, ruleIndex, 'type', e.target.value as any)}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none"
                                                        >
                                                            {Object.values(RuleType).map(t => <option key={t} value={t}>{t}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        {rule.type === RuleType.ATTRIBUTE && (
                                                            <>
                                                                <label className="text-xs text-slate-500 block mb-1">Attr</label>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="href"
                                                                    value={rule.attribute || ''}
                                                                    onChange={(e) => updateRule(depthIndex, ruleIndex, 'attribute', e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 outline-none"
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="col-span-1 flex justify-end pt-5">
                                                        <button 
                                                            onClick={() => removeRule(depthIndex, ruleIndex)}
                                                            className="text-red-400 hover:text-red-300 transition-colors"
                                                        >
                                                            <LucideTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800">
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
                >
                    <LucideSave className="w-5 h-5" />
                    Save Configuration
                </button>
            </div>
        </div>
    );
};
