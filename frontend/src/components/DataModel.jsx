import React, { useState } from 'react'
import { dataModel } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import { 
  Share2, Box, Database, Network, 
  Info, ChevronRight, X, Loader2, Zap
} from 'lucide-react';

const DataModel = () => {
    const [entities, setEntities] = useState([]);
    const [relationships, setRelationships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const { repoId } = useRepo();

    const handleDataModel = async () => {
        if (!repoId) return alert("Please connect a repo first!");
        try {
            setLoading(true);
            const result = await dataModel(repoId);
            setEntities(result.entities || []);
            setRelationships(result.relationships || []);
        } catch (error) {
            console.error("Data Model Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-var(--space-16))] overflow-hidden">
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                        <Database className="text-green-primary" size={32} />
                        Entity Data Model
                    </h1>
                    <p className="text-muted font-body mt-1">Mapping schemas and entity relationships.</p>
                </div>
                <button
                    onClick={handleDataModel}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Mapping...
                        </>
                    ) : (
                        <>
                            <Zap size={18} />
                            Analyze Model
                        </>
                    )}
                </button>
            </div>

            <div className="flex flex-grow gap-6 min-h-0">
                {/* Entity Canvas */}
                <div className="card flex-grow relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-6 border-b border-green-muted/20 pb-4">
                        <Network size={20} className="text-green-primary" />
                        <h3 className="font-display font-bold text-lg">Entity Relationship Graph</h3>
                    </div>
                    
                    <div className="card-inset flex-grow relative overflow-auto p-12 bg-bg-deep/30">
                        {entities.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                                {entities.map((entity, i) => (
                                    <div 
                                        key={i} 
                                        className={`card py-4 px-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg border border-transparent ${selectedEntity === entity ? 'border-green-primary shadow-lg scale-105' : ''}`}
                                        onClick={() => setSelectedEntity(entity)}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Box size={18} className="text-green-primary" />
                                            <span className="font-mono font-bold text-green-glow">{entity}</span>
                                        </div>
                                        <div className="space-y-1 opacity-60">
                                            <div className="h-1.5 w-full bg-deep rounded-full"></div>
                                            <div className="h-1.5 w-3/4 bg-deep rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                                <Share2 size={64} className="mb-4 text-green-muted" />
                                <p className="font-display font-bold text-xl">No model data mapped</p>
                                <p className="font-body text-sm">Run analysis to generate the entity graph</p>
                            </div>
                        )}
                        
                        {/* Mock connection lines */}
                        <svg className="absolute inset-0 pointer-events-none opacity-20" width="100%" height="100%">
                            {relationships.map((rel, i) => (
                                <path 
                                    key={i}
                                    d={`M${100 + i * 50},${100 + i * 20} Q${200 + i * 30},${150} ${300 + i * 40},${200}`} 
                                    stroke="var(--green-primary)" 
                                    strokeWidth="1.5" 
                                    fill="none" 
                                    strokeDasharray="5,5"
                                />
                            ))}
                        </svg>
                    </div>
                </div>

                {/* Detail Panel */}
                <div className={`card w-[320px] shrink-0 transition-all duration-300 ${selectedEntity ? 'translate-x-0' : 'translate-x-[340px] hidden md:flex'}`}>
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
                                <p className="text-2xl font-bold font-mono text-green-glow">{selectedEntity}</p>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display mb-3">Schema Fields</p>
                                    <div className="space-y-2">
                                        {['id', 'created_at', 'updated_at', 'metadata', 'status'].map((field) => (
                                            <div key={field} className="flex justify-between items-center p-2 card-inset text-xs">
                                                <span className="font-mono font-bold text-text-primary">{field}</span>
                                                <span className="badge text-[9px]">{field === 'id' ? 'UUID' : field.includes('at') ? 'TIMESTAMP' : 'JSONB'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted font-display mb-3">Active Relations</p>
                                    <div className="space-y-2">
                                        {relationships.filter(r => r.source === selectedEntity || r.target === selectedEntity).map((rel, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 card-inset text-[10px] font-mono">
                                                <span className="text-green-glow">{rel.source}</span>
                                                <ChevronRight size={10} className="text-muted" />
                                                <span className="text-green-glow">{rel.target}</span>
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
    )
}

export default DataModel;
