import React, { useState } from 'react';
import { orientRepo } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import {
    Folder, FileCode, ChevronRight, ListTree,
    Activity, Zap, Compass, Layers,
    FileStack, Code2, Link, Hash, Loader2
} from 'lucide-react';

const Orient = () => {
    const [entryPoint, setEntryPoint] = useState(null);
    const [flowSummary, setFlowSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const { repoId, repoData, updateRepoData } = useRepo();

    const handleOrient = async () => {
        if (!repoId) return alert("Please connect a repo first!");
        setLoading(true);
        try {
            const result = await orientRepo(repoId);
            setEntryPoint(result.entry_point);
            setFlowSummary(result.flow_summary);

            // Update RepoContext if additional metrics are provided
            if (result.metrics) {
                updateRepoData({
                    functions: result.metrics.functions || 0,
                    dependencies: result.metrics.dependencies || 0,
                    loc: result.metrics.loc || '0',
                });
            }
        } catch (error) {
            console.error("Orientation Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 py-4 flex flex-col gap-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                        <Compass className="text-green-primary" size={32} />
                        Repo Orientation
                    </h1>
                    <p className="text-muted font-body mt-1">Understanding high-level architecture and execution flow.</p>
                </div>
                <button
                    onClick={handleOrient}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing Codebase...
                        </>
                    ) : (
                        <>
                            <Zap size={18} />
                            Start Orientation
                        </>
                    )}
                </button>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card flex items-center gap-4 py-4">
                    <div className="p-3 bg-surface rounded-xl shadow-sm text-green-primary">
                        <FileStack size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Files</p>
                        <p className="text-2xl font-bold font-mono text-green-glow">{repoData.files}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 py-4">
                    <div className="p-3 bg-surface rounded-xl shadow-sm text-green-primary">
                        <Code2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Functions</p>
                        <p className="text-2xl font-bold font-mono text-green-glow">{repoData.functions || '?'}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 py-4">
                    <div className="p-3 bg-surface rounded-xl shadow-sm text-green-primary">
                        <Link size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Dependencies</p>
                        <p className="text-2xl font-bold font-mono text-green-glow">{repoData.dependencies || '?'}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 py-4">
                    <div className="p-3 bg-surface rounded-xl shadow-sm text-green-primary">
                        <Hash size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">LOC</p>
                        <p className="text-2xl font-bold font-mono text-green-glow">{repoData.loc || '?'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Entry Points List */}
                <div className="card flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                        <ListTree size={20} className="text-green-primary" />
                        <h3 className="font-display font-bold text-lg">Entry Point Analysis</h3>
                    </div>

                    <div className="card-inset flex-grow overflow-y-auto max-h-[400px]">
                        {!entryPoint ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted opacity-40">
                                <FileCode size={48} className="mb-4" />
                                <p className="font-mono text-sm">Waiting for analysis...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 p-2">
                                {typeof entryPoint === 'string' ? (
                                    entryPoint.split(/[/\\]/).map((segment, index, array) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 font-mono text-sm"
                                            style={{ marginLeft: `${index * 20}px` }}
                                        >
                                            {index > 0 && <div className="w-px h-6 bg-green-muted/30 -ml-3 mb-4"></div>}
                                            {index === array.length - 1 ? (
                                                <div className="badge">
                                                    <FileCode size={12} />
                                                    {segment}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <Folder size={14} className="text-green-primary" />
                                                    {segment}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <pre className="text-xs font-mono text-green-glow bg-bg-deep p-4 rounded-lg overflow-x-auto">
                                        {JSON.stringify(entryPoint, null, 2)}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Flow Summary */}
                <div className="card flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                        <Activity size={20} className="text-green-primary" />
                        <h3 className="font-display font-bold text-lg">Logic Flow Summary</h3>
                    </div>

                    <div className="card-inset grow overflow-y-auto max-h-[400px] p-6">
                        {!flowSummary ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted opacity-40">
                                <Layers size={48} className="mb-4" />
                                <p className="font-mono text-sm">Run orientation to map flows</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-green-muted/30 pl-6 py-2">
                                <p className="text-text-secondary leading-relaxed font-body text-sm whitespace-pre-wrap">
                                    {flowSummary}
                                </p>
                                <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-bg-surface border-2 border-green-primary shadow-sm" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Architecture Diagram Mockup */}
            <div className="card">
                <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                    <Layers size={20} className="text-green-primary" />
                    <h3 className="font-display font-bold text-lg">Architecture Overview</h3>
                </div>

                <div className="card-inset h-[300px] flex items-center justify-center relative overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 300">
                        <path d="M100,150 L250,150 M450,150 L600,150 M250,150 L350,100 M250,150 L350,200 M350,100 L450,150 M350,200 L450,150" stroke="var(--green-primary)" strokeWidth="2" fill="none" />
                    </svg>

                    <div className="relative flex gap-12 items-center">
                        <div className="card py-3 px-6 shadow-sm border border-green-muted/20">
                            <span className="font-mono text-xs font-bold text-green-glow">FRONTEND</span>
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="card py-3 px-6 shadow-sm border border-green-muted/20">
                                <span className="font-mono text-xs font-bold text-green-glow">API_GATEWAY</span>
                            </div>
                            <div className="card py-3 px-6 shadow-sm border border-green-muted/20">
                                <span className="font-mono text-xs font-bold text-green-glow">WORKERS</span>
                            </div>
                        </div>
                        <div className="card py-3 px-6 shadow-sm border border-green-muted/20">
                            <span className="font-mono text-xs font-bold text-green-glow">STORAGE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orient;
