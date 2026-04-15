import React, { useState } from 'react'
import { test } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import {  EyeOff, Eye } from 'lucide-react';

const Test = () => {
    const [covered, setCovered] = useState([]);
    const [uncovered, setUncovered] = useState([]);
    const [loading, setLoading] = useState(false);
    const { repoId } = useRepo();

    const handleDataModel = async () => {
        try {
            setLoading(true);
            const result = await test(repoId);
            setCovered(result.covered || []);
            setUncovered(result.uncovered || []);
        } catch (error) {
            console.error("Data Model Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-8 max-w-4xl mx-auto font-sans bg-white'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-3xl font-bold">Tests</h1>
            </div>

            <div className='bg-blue-50 border border-blue-200 p-6 rounded-lg mb-8'>
                <button
                    onClick={handleDataModel}
                    disabled={loading}
                    className={`px-6 py-3 rounded-full font-bold shadow-md transition ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Testing...' : '6. Test Coverage Analysis'}
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
                    <div className='bg-gray-50 p-4 border-b flex items-center gap-2 font-bold'>
                        <Eye size={18} className='text-emerald-600' /> Covered ({covered.length})
                    </div>
                    <div className='p-4 space-y-3'>
                        {covered.length > 0 ? covered.map((entity, i) => (
                            <div key={i} className='p-3 bg-gray-50 rounded border border-gray-100 hover:border-indigo-300 transition'>
                                <code className='text-emerald-600 font-bold'>{entity}</code>
                            </div>
                        )) : <p className='text-gray-400 text-sm'>No covered files.</p>}
                    </div>
                </div>

                <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
                    <div className='bg-gray-50 p-4 border-b flex items-center gap-2 font-bold'>
                        <EyeOff size={18} className='text-red-600' /> Uncovered ({uncovered.length})
                    </div>
                    <div className='p-4 space-y-3'>
                        {uncovered.length > 0 ? uncovered.map((rel, i) => (
                            <div key={i} className='p-3 bg-red-50 rounded border border-red-100 flex items-center gap-3'>
                                <span className='text-xs font-mono bg-white px-2 py-1 rounded shadow-sm'>{rel.source}</span>
                                <span className='text-gray-400'>➔</span>
                                <span className='text-xs font-mono bg-white px-2 py-1 rounded shadow-sm'>{rel.target}</span>
                            </div>
                        )) : <p className='text-gray-400 text-sm'>No uncovered files.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Test;