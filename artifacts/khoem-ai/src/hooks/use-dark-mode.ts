import { useEffect } from "react";

export function useDarkMode() {
  useEffect(() => {
    // Force dark mode on mount
    document.documentElement.classList.add('dark');
  }, []);
}
