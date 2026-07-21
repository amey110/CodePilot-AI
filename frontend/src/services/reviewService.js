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

  // Get previous reviews (backed by localStorage for persistence)
  getReviews: async () => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem('codepilot_reviews');
      if (stored) {
        try {
          resolve(JSON.parse(stored));
          return;
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
      resolve(defaultReviews);
    });
  },

  // Save new review to localStorage history
  saveReviewToHistory: (filename, pylintScore, sizeBytes, rating = 'Good', issuesCount = 0, durationMs = 1200) => {
    const stored = localStorage.getItem('codepilot_reviews');
    let reviews = [];
    if (stored) {
      try {
        reviews = JSON.parse(stored);
      } catch (e) {
        reviews = [];
      }
    }
    
    // Scale pylint score (out of 10) to percentage (0-100)
    let scorePct = Math.min(100, Math.max(0, Math.round((pylintScore || 0) * 10)));
    
    const newReview = {
      id: Date.now(),
      filename: filename || 'pasted_code.py',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      score: scorePct,
      pylintRawScore: pylintScore,
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
