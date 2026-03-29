import { Keyboard } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center gap-2 py-6 px-8">
      <Keyboard className="w-8 h-8 text-primary" />
      <h1 className="text-2xl font-bold text-primary tracking-wider">monkeytype</h1>
    </header>
  );
};

export default Header;
