"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ViewedContext = createContext(null);

export function ViewedProvider({ children }) {
  const [viewedIds, setViewedIds] = useState(new Set());

  const markViewed = useCallback((id) => {
    setViewedIds((prev) => new Set([...prev, id]));
  }, []);

  const isViewed = useCallback(
    (id) => viewedIds.has(id),
    [viewedIds]
  );

  return (
    <ViewedContext.Provider value={{ markViewed, isViewed, viewedIds }}>
      {children}
    </ViewedContext.Provider>
  );
}

export function useViewed() {
  return useContext(ViewedContext);
}
