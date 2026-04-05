import { Keyboard, Crown } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  onLeaderboard?: () => void;
}

const Header = ({ onLeaderboard }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-6 px-8">
      <div className="flex items-center gap-2">
        <Keyboard className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary tracking-wider">Speedy Typer</h1>
      </div>
      <div className="flex items-center gap-3">
        {onLeaderboard && (
          <button
            onClick={onLeaderboard}
            className="text-sub hover:text-primary transition-colors p-2"
            title="Personal Bests"
          >
            <Crown className="w-5 h-5" />
          </button>
        )}
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
