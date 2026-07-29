import { useEffect } from "react";

function useSelection(clearSelection) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        clearSelection();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);
}

export default useSelection;
