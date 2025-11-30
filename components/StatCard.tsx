import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = "indigo" }) => {
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-500/10 text-indigo-500",
        emerald: "bg-emerald-500/10 text-emerald-500",
        amber: "bg-amber-500/10 text-amber-500",
        rose: "bg-rose-500/10 text-rose-500",
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.indigo}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-1 text-sm">
                    <span className="text-emerald-400 font-medium">{trend}</span>
                    <span className="text-slate-500">vs last month</span>
                </div>
            )}
        </div>
    );
};
