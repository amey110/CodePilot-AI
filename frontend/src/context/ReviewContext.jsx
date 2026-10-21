import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetReview = useCallback(() => {
    setFile(null);
    setCode("");
    setAnalysis(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleReset = () => resetReview();
    window.addEventListener('auth-logout', handleReset);
    window.addEventListener('auth-expired', handleReset);
    return () => {
      window.removeEventListener('auth-logout', handleReset);
      window.removeEventListener('auth-expired', handleReset);
    };
  }, [resetReview]);

  const value = {
    file,
    setFile,

    code,
    setCode,

    analysis,
    setAnalysis,

    loading,
    setLoading,

    error,
    setError,

    resetReview,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error("useReview must be used inside ReviewProvider");
  }

  return context;
};
