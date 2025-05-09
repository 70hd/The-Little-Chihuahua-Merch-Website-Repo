import { useEffect, useState } from "react";

const useCurrentUrl = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;
    setUrl(decodeURIComponent(currentUrl));
  }, []);

  return url;
};

export default useCurrentUrl;
