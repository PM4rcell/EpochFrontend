import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useEra } from "../context/EraContext";

/**
 * Hook for handling back navigation with era context restoration.
 * Restores the previous era context before navigating back in browser history.
 * 
 * @param fallbackPath - Optional fallback path if there's no history to go back to
 * @returns A function to handle back navigation
 */
export function useBackNavigation(fallbackPath?: string) {
  const navigate = useNavigate();
  const { restorePreviousEra } = useEra();

  const handleBack = useCallback(() => {
    try {
      // Restore the previous era context before going back
      if (typeof restorePreviousEra === 'function') {
        restorePreviousEra();
      }
      
      // Go back to the previous page in browser history
      navigate(-1);
    } catch (error) {
      console.error('Error in handleBack:', error);
      // Fallback: navigate to provided path or home if back navigation fails
      navigate(fallbackPath || '/');
    }
  }, [navigate, restorePreviousEra, fallbackPath]);

  return handleBack;
}

export default useBackNavigation;

