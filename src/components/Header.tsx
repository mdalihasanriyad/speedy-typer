import { Keyboard } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  return (
    <header className="flex items-center justify-between py-6 px-8">
      <div className="flex items-center gap-2">
        <Keyboard className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary tracking-wider">monkeytype</h1>
      </div>
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
