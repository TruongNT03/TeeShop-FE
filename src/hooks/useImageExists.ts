import { useState, useEffect } from "react";

const useImageExists = (url: string) => {
  const [imageExists, setImageExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setImageExists(false);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.src = url;

    img.onload = () => {
      setImageExists(true);
      setLoading(false);
    };

    img.onerror = () => {
      setImageExists(false);
      setLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return { imageExists, loading };
};

export default useImageExists;
