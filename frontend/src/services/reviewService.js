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
      }
    });
    return response.data;
  },

  // Analyze python code from editor (json body)
  analyzeCode: async (code) => {
    const response = await api.post('/review/analyze', { code });
    return response.data;
  },

  // Get previous reviews (tries backend API first, falls back to localStorage)
  getReviews: async () => {
    try {
      const response = await api.get('/review/history?page=1&page_size=10');
      if (response.data?.success && Array.isArray(response.data?.reviews)) {
        if (response.data.reviews.length > 0) {
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
          }));
        }
      }
    } catch {
      // Graceful fallback to localStorage for offline / unauthenticated states
    }

    const stored = localStorage.getItem('codepilot_reviews');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored reviews:', e);
      }
    }

    const defaultReviews = [
      { id: 1, filename: 'authentication.py', date: 'Jul 21, 2026', score: 92, status: 'Completed', time: '1.2s', rating: 'Excellent', issuesCount: 1 },
      { id: 2, filename: 'data_parser.py', date: 'Jul 20, 2026', score: 78, status: 'Completed', time: '2.5s', rating: 'Average', issuesCount: 4 },
      { id: 3, filename: 'model_training.py', date: 'Jul 19, 2026', score: 85, status: 'Completed', time: '3.1s', rating: 'Good', issuesCount: 2 },
      { id: 4, filename: 'utils.py', date: 'Jul 18, 2026', score: 98, status: 'Completed', time: '0.8s', rating: 'Excellent', issuesCount: 0 },
    ];
    localStorage.setItem('codepilot_reviews', JSON.stringify(defaultReviews));
    return defaultReviews;
  },

  // Get user review stats from backend
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

  // Save new review to localStorage history
  saveReviewToHistory: (filename, pylintScore, sizeBytes, rating = 'Good', issuesCount = 0, durationMs = 1200) => {
    const stored = localStorage.getItem('codepilot_reviews');
    let reviews = [];
    if (stored) {
      try {
        reviews = JSON.parse(stored);
      } catch {
        reviews = [];
      }
    }

    const rawVal = pylintScore || 0;
    const scorePct = rawVal > 10 
      ? Math.min(100, Math.max(0, Math.round(rawVal)))
      : Math.min(100, Math.max(0, Math.round(rawVal * 10)));

    const newReview = {
      id: Date.now(),
      filename: filename || 'pasted_code.py',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: scorePct,
      rawScore: rawVal,
      rating: rating,
      status: 'Completed',
      issuesCount: issuesCount,
      time: `${(durationMs / 1000).toFixed(1)}s`,
      sizeBytes: sizeBytes
    };

    const updatedReviews = [newReview, ...reviews].slice(0, 20);
    localStorage.setItem('codepilot_reviews', JSON.stringify(updatedReviews));
    window.dispatchEvent(new Event('reviews-updated'));
    return newReview;
  }
};
