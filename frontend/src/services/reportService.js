import api from './api';

export const reportService = {
  // Download a review report as JSON attachment
  downloadReport: async (reviewId, filename = `review_${reviewId}`) => {
    const response = await api.get(`/review/${reviewId}/report`, {
      responseType: 'blob',
    });

    // Create a temporary link and trigger download in the browser
    const blob = new Blob([response.data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = (filename || `review_${reviewId}`).replace(/\.[^/.]+$/, '');
    link.setAttribute('download', `${cleanName}_report.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },
};
