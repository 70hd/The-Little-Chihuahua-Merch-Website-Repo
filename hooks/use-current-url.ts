import { useEffect, useState } from "react";

const useCurrentUrl = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const url = window.location.pathname + window.location.search + window.location.hash
        setUrl(decodeURIComponent(url));
    }
  }, []);

  return url;
};

export default useCurrentUrl;