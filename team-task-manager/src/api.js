const API_BASE_URL = 'http://127.0.0.1:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API error');
  }
  return data;
};

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const authRegister = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const authLogin = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const getProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const createProject = async (project, token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

export const patchProjectMembers = async (projectId, payload, token) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members`, {
    method: 'PATCH',
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateProject = async (projectId, updates, token) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const getTasks = async (userId, token, projectId) => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (projectId) params.append('projectId', projectId);
  const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`, {
    headers: getHeaders(token),
  });
  return handleResponse(response);
};

export const createTask = async (task, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(task),
  });
  return handleResponse(response);
};

export const updateTask = async (id, updates, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteTask = async (id, token) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  return handleResponse(response);
};