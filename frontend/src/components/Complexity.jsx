import React, { useState } from 'react'
import { complexity } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import { 
  AlertTriangle, Code2, FileCode, BarChart3, 
  TrendingUp, Zap, ShieldAlert, Loader2 
} from 'lucide-react';

const Complexity = () => {
    const [hotspots, setHotspots] = useState([]);
    const [loading, setLoading] = useState(false);
    const { repoId } = useRepo();

    const handleComplexity = async () => {
        if (!repoId) return alert("Fetch a Repo ID first!");
        setLoading(true);
        try {
            const result = await complexity(repoId);
            setHotspots(result.hotspots || []);
        } catch (error) {
            console.error("Complexity Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const avgComp = hotspots.length > 0 
        ? (hotspots.reduce((acc, curr) => acc + (parseInt(curr.complexity) || 0), 0) / hotspots.length).toFixed(1)
        : "0.0";
    
    const getDebtScore = (avg) => {
        const val = parseFloat(avg);
        if (val === 0) return "-";
        if (val < 10) return "A";
        if (val < 15) return "B+";
        if (val < 20) return "B";
        if (val < 25) return "C";
        return "D";
    };

    const debtScore = getDebtScore(avgComp);

    return (
        <div className="space-y-8 py-4 flex flex-col gap-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                        <BarChart3 className="text-green-primary" size={32} />
                        Complexity Analysis
                    </h1>
                    <p className="text-muted font-body mt-1">Identifying hotspots and technical debt across the codebase.</p>
                </div>
                <button
                    onClick={handleComplexity}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Calculating...
                        </>
                    ) : (
                        <>
                            <TrendingUp size={18} />
                            Run Analysis
                        </>
                    )}
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Avg Complexity</span>
                        <Zap size={16} className="text-green-primary" />
                    </div>
                    <p className="text-3xl font-bold font-mono text-green-glow">{avgComp}</p>
                    <div className="h-1 w-full bg-deep rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-green-primary" style={{ width: `${Math.min(100, parseFloat(avgComp) * 4)}%` }}></div>
                    </div>
                </div>
                <div className="card flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Hotspots Found</span>
                        <AlertTriangle size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-bold font-mono text-amber-500">{hotspots.length || '0'}</p>
                    <div className="h-1 w-full bg-deep rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, hotspots.length * 5)}%` }}></div>
                    </div>
                </div>
                <div className="card flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Debt Score</span>
                        <ShieldAlert size={16} className="text-red-500" />
                    </div>
                    <p className="text-3xl font-bold font-mono text-red-500">{debtScore}</p>
                    <div className="h-1 w-full bg-deep rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-red-500" style={{ width: debtScore === 'A' ? '10%' : debtScore === 'B+' ? '30%' : debtScore === 'B' ? '50%' : '80%' }}></div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="card flex flex-col">
                <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                    <TrendingUp size={20} className="text-green-primary" />
                    <h3 className="font-display font-bold text-lg">Complexity Distribution</h3>
                </div>
                <div className="h-fit card-inset h-[240px] flex gap-3 p-8 flex-wrap items-end justify-start">
                    {hotspots.length > 0 ? (
                        hotspots.slice(0, 15).map((item, i) => {
                            const height = Math.min(100, (parseInt(item.complexity) || 0) * 3);
                            return (
                                <div 
                                    key={i} 
                                    className="w-fit w-8 rounded-t-lg transition-all duration-500 hover:scale-x-110 relative group"
                                    style={{ 
                                        height: `${height}%`, 
                                        background: height > 80 ? 'var(--error)' : height > 60 ? 'var(--warning)' : 'var(--green-primary)',
                                        opacity: 0.8
                                    }}
                                >
                                    <div className="bg-bg-surface py-1 px-2 rounded shadow-sm border border-green-muted/20 transition-opacity whitespace-nowrap z-10">
                                        <span className="font-mono text-[10px] text-green-glow">{item.file.split('/').pop()}: {item.complexity}</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full opacity-30">
                            <BarChart3 size={48} />
                            <p className="text-xs font-mono mt-2">No data to visualize</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Hotspots Table */}
            <div className="card">
                <div className="flex items-center justify-between mb-6 border-b border-green-muted/20 pb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={20} className="text-amber-500" />
                        <h3 className="font-display font-bold text-lg">Identified Hotspots</h3>
                    </div>
                    <span className="badge bg-amber-50 text-amber-600 border border-amber-200">
                        {hotspots.length} Issues
                    </span>
                </div>

                {hotspots.length > 0 ? (
                    <div className="space-y-3">
                        {hotspots.map((item, index) => (
                            <div key={index} className={`card-inset mb-5! p-4 flex flex-col md:flex-row justify-between gap-10 border-l-4 ${item.complexity > 20 ? 'border-red-500' : 'border-amber-500'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-bg-surface rounded shadow-sm">
                                        <FileCode size={20} className="text-green-primary" />
                                    </div>
                                    <div>
                                        <p className="font-mono font-bold text-sm text-text-primary">{item.file}</p>
                                        <p className="font-mono text-[10px] text-muted uppercase tracking-wider">fn: {item.function}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">Complexity</p>
                                        <p className={`font-mono font-bold ${item.complexity > 20 ? 'text-red-500' : 'text-amber-500'}`}>{item.complexity}</p>
                                    </div>
                                    <span className="badge text-[10px]">
                                        {item.issue}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card-inset py-20 flex flex-col items-center justify-center opacity-40">
                        <Code2 size={48} className="mb-4" />
                        <p className="font-body text-sm">No analysis data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Complexity;
