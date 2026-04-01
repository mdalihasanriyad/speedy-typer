import { useState, useEffect, useRef } from "react";
import { Palette } from "lucide-react";

const THEMES = [
  { id: "dark", label: "Dark", dot: "hsl(43 72% 49%)" },
  { id: "light", label: "Light", dot: "hsl(0 0% 14%)" },
  { id: "ocean", label: "Ocean", dot: "hsl(190 70% 50%)" },
  { id: "forest", label: "Forest", dot: "hsl(80 55% 48%)" },
  { id: "lavender", label: "Lavender", dot: "hsl(280 60% 65%)" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "typing-theme";

function getStoredTheme(): ThemeId {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && THEMES.some((t) => t.id === v)) return v as ThemeId;
  } catch {}
  return "dark";
}

function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  localStorage.setItem(STORAGE_KEY, id);
}

// Apply on load before React mounts
applyTheme(getStoredTheme());

const ThemeSwitcher = () => {
  const [current, setCurrent] = useState<ThemeId>(getStoredTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(current);
  }, [current]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sub hover:text-foreground transition-colors p-2"
        title="Change theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg p-2 shadow-lg z-50 min-w-[140px]">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setCurrent(theme.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                current === theme.id
                  ? "text-primary bg-secondary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: theme.dot }}
              />
              {theme.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
