import { useEffect, useState } from "react";

export function useSidebarCollapsed(sidebarId = "sidebar") {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.getElementById(sidebarId);
      if (sidebar) {
        setIsSidebarCollapsed(sidebar.classList.contains("collapsed"));
      }
    };

    checkSidebarState(); // ao montar

    const observer = new MutationObserver(() => {
      checkSidebarState();
    });

    const sidebarEl = document.getElementById(sidebarId);
    if (sidebarEl) {
      observer.observe(sidebarEl, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      observer.disconnect();
    };
  }, [sidebarId]);

  return isSidebarCollapsed;
}
