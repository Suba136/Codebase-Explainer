import React, { useState } from 'react';
import { run, report } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import ReactMarkdown from 'react-markdown';
import {
    Folder, FileCode, ChevronRight, ListTree,
    Activity, Zap, Compass, Layers,
    FileStack, Code2, Link, Hash, Loader2,
    AlertTriangle, BarChart3, TrendingUp, ShieldAlert,
    Share2, Box, Database, Network, Info, X, FileText,
    ScrollText
} from 'lucide-react';
import Markdown from 'react-markdown';

const Report = () => {
    const [summary, setSummary] = useState(null);
    const [entryPoint, setEntryPoint] = useState(null);
    const [flowSummary, setFlowSummary] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const [entities, setEntities] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);

    const [loading, setLoading] = useState(false);
    const { repoId, repoData, updateRepoData } = useRepo();

    const generateReport = async () => {
        if (!repoId) return alert("Please connect a repo first!");
        setLoading(true);
        try {
            await run(repoId);
            const result = await report(repoId);
            console.log("Report Result:", result);

            setSummary(result.summary || null);
            setEntryPoint(result.architecture?.entry_point || null);
            setFlowSummary(result.flow?.flow || null);
            setHotspots(result.hotspots || []);
            setEntities(result.data_models?.entities || []);
            setRelationships(result.data_models?.relationships || []);

            if (result.metrics) {
                updateRepoData({
                    functions: result.metrics.functions || 0,
                    dependencies: result.metrics.dependencies || 0,
                    loc: result.metrics.loc || '0',
                });
            }

        } catch (error) {
            console.error("Analysis Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const avgComplexity = hotspots.length > 0
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

    const debtScore = getDebtScore(avgComplexity);

    return (
        <div className='flex flex-col gap-5! justify-center w-full max-w-7xl mx-auto'>

            {/* --- MASTER HEADER --- */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                        <ScrollText className="text-green-primary" size={32} />
                         Codebase Intelligence Report
                    </h1>
                    <p className="text-muted font-body mt-1">Comprehensive analysis of architecture, complexity, and entity relationships.</p>
                </div>
                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="btn-primary px-8 py-3 text-lg"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Generating Report...
                        </>
                    ) : (
                        <>
                            <Zap size={20} />
                            Generate Report
                        </>
                    )}
                </button>
            </div>

            {/* --- SUMMARY SECTION --- */}
            {summary && (
                <div className="w-full space-y-8 py-4">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                            <FileText size={20} className="text-green-primary" />
                            <h3 className="font-display font-bold text-lg">AI Generated Summary</h3>
                        </div>
                        <div className="card-inset p-6 bg-bg-deep/30">
                            <div className="prose prose-invert prose-green max-w-none text-text-secondary whitespace-pre-wrap font-body text-sm leading-relaxed">
                                <Markdown>{summary}</Markdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ORIENTATION SECTION --- */}
            <div className="w-full flex flex-col gap-5 space-y-8 py-4 mb-10!">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                        <Compass className="text-green-primary" size={28} />
                        Repo Orientation
                    </h2>
                </div>

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
                    <div className="card flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                            <ListTree size={20} className="text-green-primary" />
                            <h3 className="font-display font-bold text-lg">Entry Point Analysis</h3>
                        </div>

                        <div className="card-inset flex-grow overflow-y-auto max-h-[400px]">
                            {!entryPoint ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted opacity-40">
                                    <FileCode size={48} className="mb-4" />
                                    <p className="font-mono text-sm">Generate report to view entry points</p>
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

                    <div className="card flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                            <Activity size={20} className="text-green-primary" />
                            <h3 className="font-display font-bold text-lg">Logic Flow Summary</h3>
                        </div>

                        <div className="card-inset flex-grow overflow-y-auto max-h-[400px] p-6">
                            {!flowSummary ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted opacity-40">
                                    <Layers size={48} className="mb-4" />
                                    <p className="font-mono text-sm">Generate report to map flows</p>
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
            </div>

            {/* --- COMPLEXITY SECTION --- */}
            <div className="w-full flex flex-col gap-5 space-y-8 py-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                        <BarChart3 className="text-green-primary" size={28} />
                        Complexity Analysis
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-display">Avg Complexity</span>
                            <Zap size={16} className="text-green-primary" />
                        </div>
                        <p className="text-3xl font-bold font-mono text-green-glow">{avgComplexity}</p>
                        <div className="h-1 w-full bg-deep rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-green-primary" style={{ width: `${Math.min(100, parseFloat(avgComplexity) * 4)}%` }}></div>
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
                        <div className="space-y-3 flex flex-col gap-3">
                            {hotspots.map((item, index) => {
                                const complexityScore = parseInt(item.complexity) || 0;
                                const isHighRisk = complexityScore > 20 || item.issue === 'JS function detected';

                                return (
                                    <div key={index} className={`card-inset p-4 flex flex-col md:flex-row justify-between gap-4 border-l-4 ${isHighRisk ? 'border-red-500' : 'border-amber-500'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-bg-surface rounded shadow-sm flex-shrink-0">
                                                <FileCode size={20} className="text-green-primary" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-mono font-bold text-sm text-text-primary truncate">{item.file}</p>
                                                <p className="font-mono text-[10px] text-muted uppercase tracking-wider truncate">fn: {item.function}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-muted uppercase tracking-tighter">Complexity</p>
                                                <p className={`font-mono font-bold ${isHighRisk ? 'text-red-500' : 'text-amber-500'}`}>{item.complexity}</p>
                                            </div>
                                            <span className="badge text-[10px]">
                                                {item.issue}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="card-inset py-20 flex flex-col items-center justify-center opacity-40">
                            <Code2 size={48} className="mb-4" />
                            <p className="font-body text-sm">Generate report to view hotspots.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- DATA MODEL SECTION --- */}
            <div className="w-full relative flex flex-col gap-5 mt-10! min-h-[600px] overflow-hidden pb-12">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-3">
                        <Database className="text-green-primary" size={28} />
                        Entity Data Model
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row flex-grow gap-6">
                    <div className="card flex-grow relative overflow-hidden flex flex-col min-h-[400px]">
                        <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                            <Network size={20} className="text-green-primary" />
                            <h3 className="font-display font-bold text-lg">Entity Relationship Graph</h3>
                        </div>

                        <div className="h-fit card-inset flex-grow relative overflow-auto p-6 md:p-12 bg-bg-deep/30">
                            {entities.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 z-10 relative">
                                    {entities.map((entity, i) => (
                                        <div
                                            key={i}
                                            className={`card py-4 px-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent ${selectedEntity === entity ? 'border-green-primary shadow-lg scale-105' : ''}`}
                                            onClick={() => setSelectedEntity(entity)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <Box size={18} className="text-green-primary flex-shrink-0" />
                                                <span className="font-mono font-bold text-green-glow truncate" title={entity}>{entity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                                    <Share2 size={64} className="mb-4 text-green-muted" />
                                    <p className="font-display font-bold text-xl">No model data mapped</p>
                                    <p className="font-body text-sm">Generate report to populate entity graph.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`flex flex-col align-center card w-full md:w-[320px] shrink-0 transition-all duration-300 ${selectedEntity ? 'block' : 'hidden md:flex'}`}>
                        {selectedEntity ? (
                            <div className="flex flex-col h-full page-enter">
                                <div className="flex justify-between items-start mb-6 border-b border-green-muted/20 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Info size={20} className="text-green-primary" />
                                        <h3 className="font-display font-bold text-lg">Entity Details</h3>
                                    </div>
                                    <button
                                        className="p-1 hover:bg-bg-deep rounded-full text-muted transition-colors"
                                        onClick={() => setSelectedEntity(null)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display mb-1">Entity Name</p>
                                    <p className="text-xl font-bold font-mono text-green-glow break-words">{selectedEntity}</p>
                                </div>

                                <div className="flex-grow overflow-y-auto space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display mb-3">Entity Properties</p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-2 card-inset text-xs">
                                                <span className="font-mono font-bold text-text-primary">Type</span>
                                                <span className="badge text-[9px]">ENTITY</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 card-inset text-xs">
                                                <span className="font-mono font-bold text-text-primary">Scope</span>
                                                <span className="badge text-[9px]">INTERNAL</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display mb-3">Active Relations</p>
                                        <div className="space-y-2">
                                            {relationships.filter(r => r.source === selectedEntity || r.target === selectedEntity).map((rel, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2 card-inset text-[10px] font-mono">
                                                    <span className="text-green-glow truncate">{rel.source}</span>
                                                    <ChevronRight size={10} className="text-muted flex-shrink-0" />
                                                    <span className="text-green-glow truncate">{rel.target}</span>
                                                </div>
                                            ))}
                                            {relationships.filter(r => r.source === selectedEntity || r.target === selectedEntity).length === 0 && (
                                                <p className="text-[10px] italic text-muted text-center py-4">No relationships identified</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-40">
                                <Box size={48} className="mb-4 text-green-muted" />
                                <p className="font-display font-bold">Select an Entity</p>
                                <p className="text-xs mt-2">Click on a node in the graph to view its detailed schema and relations.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Report;