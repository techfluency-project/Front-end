import { useEffect, useState } from "react";

function useFitText(containerRef: React.RefObject<HTMLDivElement>) {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      const container = containerRef.current!;
      const width = container.offsetWidth;
      const newSize = Math.max(12, Math.min(width / 10, 48)); // adjust divisor as needed
      setFontSize(newSize);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef]);

  return fontSize;
}

export default useFitText
