import React, { useState } from 'react';
import { ingestRepo } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import { Folder, File, ChevronRight, ChevronDown, Upload, FileJson, FileCode, CheckCircle2, Loader2 } from 'lucide-react';

const Ingest = () => {
    const [fileTree, setFileTree] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { repoId } = useRepo();

    const processFileTree = (rawTree) => {
        if (!rawTree) return [];

        return Object.keys(rawTree)
            .filter(path => !path.includes('/.git'))
            .map(path => {
                const cleanPath = path.split('/').slice(2).join('/') || 'Root';
                return {
                    displayPath: cleanPath,
                    files: rawTree[path]
                };
            });
    };

    const handleIngest = async () => {
        if (!repoId) return alert("Please connect a repo first!");
        setLoading(true);
        setProgress(30);
        try {
            const data = await ingestRepo(repoId);
            setProgress(100);
            setFileTree(processFileTree(data.file_tree));
        } catch (error) {
            console.error("Ingestion Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="card w-full max-w-[640px]">
                <h2 className="text-2xl font-bold mb-6 font-display" style={{ color: 'var(--text-primary)' }}>Ingest Codebase</h2>
                
                {!fileTree ? (
                    <div className="space-y-6">
                        <div 
                            className="card-inset flex flex-col items-center justify-center p-12 border-2 border-dashed border-green-muted/30 hover:border-green-primary transition-colors cursor-pointer"
                            onClick={handleIngest}
                        >
                            <div className="p-4 bg-surface rounded-full shadow-sm mb-4">
                                <Upload size={32} className="text-green-primary" />
                            </div>
                            <p className="text-lg font-display font-semibold mb-2">Initialize Ingestion</p>
                            <p className="text-sm text-muted text-center max-w-[300px]">Connected Repository: <span className="font-mono text-green-glow">{repoId || 'None'}</span></p>
                        </div>

                        {loading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-mono text-muted mb-1">
                                    <span>STATUS: ANALYZING_RESOURCES</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-deep rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-green-primary transition-all duration-500 ease-out" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <button 
                            className="btn-primary w-full"
                            onClick={handleIngest}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Analyzing Files...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={18} />
                                    Start Ingestion
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="page-enter">
                        <div className="flex items-center gap-3 mb-6 p-4 bg-green-soft/30 rounded-xl border border-green-muted/20">
                            <CheckCircle2 size={24} className="text-green-glow" />
                            <div>
                                <p className="font-bold text-green-glow font-display">Ingestion Complete</p>
                                <p className="text-xs text-muted font-mono">{fileTree.length} directories analyzed</p>
                            </div>
                        </div>

                        <div className="card-inset max-h-[400px] overflow-y-auto">
                            {fileTree.map((folder, idx) => (
                                <div key={idx} className="mb-4">
                                    <div className="flex items-center gap-2 text-green-glow font-medium mb-1 font-mono text-sm">
                                        <ChevronDown size={14} />
                                        <Folder size={14} />
                                        <span>{folder.displayPath}</span>
                                    </div>
                                    <div className="ml-6 space-y-1">
                                        {folder.files.map((file, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2 text-muted hover:text-green-primary cursor-default py-0.5">
                                                <File size={12} className="opacity-50" />
                                                <span className="text-xs font-mono">{file}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ingest;
