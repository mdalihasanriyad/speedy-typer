import { useState } from "react";

interface CustomTextInputProps {
  onSubmit: (text: string) => void;
}

const CustomTextInput = ({ onSubmit }: CustomTextInputProps) => {
  const [text, setText] = useState("");

  return (
    <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
      <p className="text-sub text-sm">Paste or type your custom text below, then press Start.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-32 bg-secondary text-foreground rounded-lg p-4 text-sm font-mono resize-none outline-none border border-transparent focus:border-primary/40 transition-colors placeholder:text-sub/50"
        autoFocus
      />
      <button
        onClick={() => {
          const trimmed = text.trim();
          if (trimmed.length > 0) onSubmit(trimmed);
        }}
        disabled={text.trim().length === 0}
        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        Start Typing
      </button>
    </div>
  );
};

export default CustomTextInput;
