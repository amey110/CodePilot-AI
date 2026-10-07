import api from './api';

export const reviewService = {
  // Upload Python file (multipart/form-data) with upload progress callback
  uploadFile: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/review/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Analyze python code from editor (json body)
  analyzeCode: async (code) => {
    const response = await api.post('/review/analyze', { code });
    return response.data;
  },

  // Get previous reviews from backend API (no fake data)
  getReviews: async (page = 1, pageSize = 20) => {
    const response = await api.get(`/review/history?page=${page}&page_size=${pageSize}`);
    if (response.data?.success && Array.isArray(response.data?.reviews)) {
      return response.data.reviews.map((r) => ({
        id: r.id,
        filename: r.filename || 'pasted_code.py',
        date: r.created_at
          ? new Date(r.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : 'Recent',
        score: Math.round(r.score || 0),
        status: 'Completed',
        time: '1.2s',
        rating: r.rating || 'Good',
        raw: r,
      }));
    }
    return [];
  },

  // Get raw paginated history object
  getHistory: async (page = 1, pageSize = 10) => {
    const response = await api.get(`/review/history?page=${page}&page_size=${pageSize}`);
    return response.data;
  },

  // Get single review by ID
  getReviewById: async (reviewId) => {
    const response = await api.get(`/review/${reviewId}`);
    return response.data?.review || response.data;
  },

  // Get user review aggregate statistics
  getStats: async () => {
    const response = await api.get('/review/stats');
    return response.data;
  },

  // Delete review by ID
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/review/${reviewId}`);
    return response.data;
  },

  // Download review JSON report
  downloadReport: async (reviewId) => {
    const response = await api.get(`/review/${reviewId}/report`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
