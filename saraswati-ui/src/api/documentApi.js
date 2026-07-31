import api from './client';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

/** GET /api/subjects/:subjectId/documents */
export function listDocuments(subjectId) {
  return api.get(`/api/subjects/${subjectId}/documents`);
}

/**
 * POST /api/subjects/:subjectId/documents — multipart upload
 * @param {number} subjectId
 * @param {File} file
 * @param {(progress: number) => void} [onProgress]  — NOTE: fetch doesn't support upload progress natively; use XHR version below for progress
 */
export async function uploadDocument(subjectId, file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  // Use XHR for progress support
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('saraswati_token');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}/api/subjects/${subjectId}/documents`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(null);
        }
      } else {
        let detail = `HTTP ${xhr.status}`;
        try {
          detail = JSON.parse(xhr.responseText)?.detail ?? detail;
        } catch {}
        reject(new Error(detail));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/** GET /api/subjects/:subjectId/documents/:docId */
export function getDocument(subjectId, docId) {
  return api.get(`/api/subjects/${subjectId}/documents/${docId}`);
}

/** GET /api/subjects/:subjectId/documents/:docId/status */
export function getDocumentStatus(subjectId, docId) {
  return api.get(`/api/subjects/${subjectId}/documents/${docId}/status`);
}

/** DELETE /api/subjects/:subjectId/documents/:docId */
export function deleteDocument(subjectId, docId) {
  return api.delete(`/api/subjects/${subjectId}/documents/${docId}`);
}

/**
 * Returns the URL to serve the PDF inline.
 * Used as the `file` prop for PDFViewer.
 */
export function getDocumentFileUrl(subjectId, docId) {
  const token = localStorage.getItem('saraswati_token');
  // We construct a URL with a token query param as PDFViewer can't set custom headers.
  // The backend will be updated to accept ?token= for PDF serving.
  return `${BASE_URL}/api/subjects/${subjectId}/documents/${docId}/file?token=${token ?? ''}`;
}
