import React, { useState } from 'react';
import { fetchRepoId } from '../lib/api'; 
import { useRepo } from '../context/RepoContext';
import { Code2, Loader2, GitBranch, Star, ChevronRight } from 'lucide-react';

const GetRepo = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [repoMeta, setRepoMeta] = useState(null);
  const { repoId, setRepoId } = useRepo();

  const handleFetchRepoId = async (inputUrl) => {
    if (!inputUrl) return;
    setLoading(true);
    try {
      const result = await fetchRepoId({ url: inputUrl });
      setRepoId(result.repo_id);
      setRepoMeta(result.metadata || null);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-[560px]">
        <h2 className="text-2xl font-bold mb-6 font-display" style={{ color: 'var(--text-primary)' }}>Connect Repository</h2>
        
        <div className="relative mb-6">
          <input 
            className="input pl-12"
            type="text" 
            placeholder="https://github.com/user/repo"
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
          />
        </div>

        <button 
          className="btn-primary w-full"
          onClick={() => handleFetchRepoId(url)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <GitBranch size={18} />
              Fetch Repository
            </>
          )}
        </button>

        {repoId && (
          <div className="mt-8 page-enter">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3 font-display">Result Preview</h3>
            <div className="card-inset flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-xl shadow-sm">
                  <GitBranch size={24} className="text-green-primary" />
                </div>
                <div>
                  <p className="font-mono font-bold text-green-glow">{repoId}</p>
                  <div className="flex gap-3 mt-1">
                    {repoMeta?.language && <span className="badge">{repoMeta.language}</span>}
                    {repoMeta?.stars !== undefined && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
                        <Star size={10} /> {repoMeta.stars}
                      </div>
                    )}
                    {!repoMeta && <span className="badge">Connected</span>}
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted opacity-50" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetRepo;
