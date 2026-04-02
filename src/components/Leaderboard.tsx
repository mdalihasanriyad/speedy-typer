import { Crown, Trash2, X } from "lucide-react";
import { getAllPersonalBests, clearAllPersonalBests, type PersonalBestEntry } from "@/lib/personalBest";
import { useState } from "react";

interface LeaderboardProps {
  open: boolean;
  onClose: () => void;
}

const Leaderboard = ({ open, onClose }: LeaderboardProps) => {
  const [entries, setEntries] = useState<PersonalBestEntry[]>(getAllPersonalBests);

  if (!open) return null;

  const handleClear = () => {
    clearAllPersonalBests();
    setEntries([]);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-background border border-secondary rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Crown className="w-5 h-5" /> Personal Bests
          </h2>
          <button onClick={onClose} className="text-sub hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-sub text-center py-8">No records yet. Complete a test to set your first personal best!</p>
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-[1fr_80px_80px_70px] gap-2 text-xs text-sub px-3 pb-1">
              <span>mode</span>
              <span className="text-right">wpm</span>
              <span className="text-right">acc</span>
              <span className="text-right">date</span>
            </div>
            {entries.map((entry) => (
              <div
                key={`${entry.mode}-${entry.value}`}
                className="grid grid-cols-[1fr_80px_80px_70px] gap-2 items-center bg-secondary/30 rounded-lg px-3 py-2.5"
              >
                <span className="text-foreground font-medium text-sm">
                  {entry.mode} {entry.value}{entry.mode === "time" ? "s" : "w"}
                </span>
                <span className="text-right text-primary font-bold tabular-nums">{entry.wpm}</span>
                <span className="text-right text-sub tabular-nums text-sm">
                  {entry.accuracy != null ? `${entry.accuracy}%` : "—"}
                </span>
                <span className="text-right text-sub text-xs">{formatDate(entry.date)}</span>
              </div>
            ))}
          </div>
        )}

        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="mt-4 flex items-center gap-1.5 text-xs text-sub hover:text-text-incorrect transition-colors mx-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear all records
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
