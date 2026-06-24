import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useActiveSection(sectionIds: string[], options?: IntersectionObserverInit) {
  const setActiveSection = useAppStore((state) => state.setActiveSection);

  useEffect(() => {
    const observerOptions = options || {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section is in middle of viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      observer.disconnect();
    };
  }, [sectionIds, options, setActiveSection]);
}
