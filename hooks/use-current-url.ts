import { useEffect, useState } from "react";

const useCurrentUrl = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // This effect will run after the component mounts on the client-side
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    setUrl(decodeURIComponent(currentUrl));
  }, []); // Empty dependency array means this effect runs once after the initial render

  return url;
};

export default useCurrentUrl;