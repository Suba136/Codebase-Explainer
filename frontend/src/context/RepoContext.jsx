import React, { createContext, useState, useContext } from 'react';

const RepoContext = createContext();

export const RepoProvider = ({ children }) => {
  const [repoId, setRepoId] = useState(null);

  return (
    <RepoContext.Provider value={{ repoId, setRepoId }}>
      {children}
    </RepoContext.Provider>
  );
};

export const useRepo = () => useContext(RepoContext);