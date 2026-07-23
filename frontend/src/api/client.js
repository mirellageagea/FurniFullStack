const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const token = localStorage.getItem('furni_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const message =
      (data && data.errors && Object.values(data.errors).flat().join(' ')) ||
      (data && data.title) ||
      (typeof data === 'string' ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body });
export const apiPut = (path, body) => request(path, { method: 'PUT', body });
export const apiDelete = (path) => request(path, { method: 'DELETE' });
export const apiPostForm = (path, formData) => request(path, { method: 'POST', body: formData, isFormData: true });
export const apiPutForm = (path, formData) => request(path, { method: 'PUT', body: formData, isFormData: true });

// Product images uploaded via the API come back as "/images/products/xyz.png" -
// relative to the API host. In dev mode that's a different origin than the
// frontend, so we still need to qualify it; after a merged build it's the same
// origin either way, so this works in both modes.
export const imageUrl = (path) => (path ? `${API_URL}${path}` : null);

export { API_URL };
