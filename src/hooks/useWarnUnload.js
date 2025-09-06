import { useEffect } from "react";

export function useBeforeUnload(shouldWarn) {
  useEffect(() => {
    const handler = (e) => {
      if (!shouldWarn) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldWarn]);
}
