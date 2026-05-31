import { useState, useEffect, useCallback } from 'react';

export function useResponsiveColumns(containerRef: React.RefObject<HTMLElement | null>) {
  const [columns, setColumns] = useState(4);

  const updateColumns = useCallback(() => {
    const width = containerRef.current?.clientWidth ?? 1280;
    if (width < 640) setColumns(1);
    else if (width < 1024) setColumns(2);
    else if (width < 1280) setColumns(3);
    else setColumns(4);
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateColumns();

    const observer = new ResizeObserver(() => updateColumns());
    observer.observe(el);
    return () => observer.disconnect();
  }, [containerRef, updateColumns]);

  return columns;
}
