import { createContext, useContext, useState } from "react";

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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