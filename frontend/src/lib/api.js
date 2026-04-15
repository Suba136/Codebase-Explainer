const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchRepoId = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/repo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload), 
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export const ingestRepo = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/analyze/ingest/${repoId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: '', 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Ingestion failed: ${response.status}`);
  }

  return await response.json();
};

export const orientRepo = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/analyze/orient/${repoId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: '', 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Orientation failed: ${response.status}`);
  }

  return await response.json();
};

export const dataModel = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/analyze/data-model/${repoId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: '', 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Data model Fetch failed: ${response.status}`);
  }

  return await response.json();
};

export const complexity = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/analyze/complexity/${repoId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: '', 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Complexity analysis failed: ${response.status}`);
  }

  return await response.json();
};

export const test = async (repoId) => {
  const response = await fetch(`${API_BASE_URL}/analyze/tests/${repoId}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: '', 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Test analysis failed: ${response.status}`);
  }

  return await response.json();
};