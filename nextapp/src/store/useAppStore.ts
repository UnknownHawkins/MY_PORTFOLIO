import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface AppState {
  // Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Active navigation section
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Mobile menu visibility
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Defaults
  theme: "dark", // default to dark first as requested
  activeSection: "home",
  mobileMenuOpen: false,

  // Theme actions
  setTheme: (theme) => {
    // Save to localStorage if client-side
    if (typeof window !== "undefined") {
      localStorage.setItem("theme-preference", theme);
      
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      let resolvedTheme = theme;
      if (theme === "system") {
        resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      root.classList.add(resolvedTheme);
      root.style.colorScheme = resolvedTheme;
    }
    set({ theme });
  },

  // Active section
  setActiveSection: (activeSection) => set({ activeSection }),

  // Mobile menu
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));
