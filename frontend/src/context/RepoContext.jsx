import React, { createContext, useState, useContext } from 'react';

const RepoContext = createContext();

export const RepoProvider = ({ children }) => {
  const [repoId, setRepoId] = useState(null);
  const [repoData, setRepoData] = useState({
    files: 0,
    functions: 0,
    dependencies: 0,
    loc: '0',
    fileTree: null,
  });

  const updateRepoData = (newData) => {
    setRepoData(prev => ({ ...prev, ...newData }));
  };

  return (
    <RepoContext.Provider value={{ repoId, setRepoId, repoData, updateRepoData }}>
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => useContext(RepoContext);