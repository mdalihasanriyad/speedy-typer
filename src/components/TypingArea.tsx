import { useEffect, useMemo, useRef } from "react";

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  typedHistory: string[];
  isFinished: boolean;
}

const TypingArea = ({ words, currentWordIndex, currentInput, typedHistory, isFinished }: TypingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const word = activeWordRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const wordTop = word.getBoundingClientRect().top;
      const offset = wordTop - containerTop;
      if (offset > 90) {
        container.scrollTop += offset - 30;
      }
    }
  }, [currentWordIndex]);

  const renderedWords = useMemo(() => {
    return words.map((word, wIdx) => {
      const isActive = wIdx === currentWordIndex;
      const isTyped = wIdx < currentWordIndex;
      const typedWord = isTyped ? typedHistory[wIdx] : isActive ? currentInput : "";

      const chars = word.split("").map((char, cIdx) => {
        let className = "text-foreground"; // untyped

        if (isTyped || isActive) {
          if (cIdx < typedWord.length) {
            className = typedWord[cIdx] === char ? "text-text-correct" : "text-text-incorrect";
          } else if (isTyped) {
            // word was submitted incomplete
            className = "text-text-incorrect opacity-60";
          }
        }

        return (
          <span key={cIdx} className={className}>
            {char}
          </span>
        );
      });

      // Extra characters typed beyond the word length
      const extraChars =
        typedWord.length > word.length
          ? typedWord
              .slice(word.length)
              .split("")
              .map((ch, i) => (
                <span key={`extra-${i}`} className="text-text-extra">
                  {ch}
                </span>
              ))
          : null;

      return (
        <div
          key={wIdx}
          ref={isActive ? activeWordRef : undefined}
          className={`inline-block mr-[10px] mb-1 relative ${
            isActive ? "" : ""
          }`}
        >
          {isActive && (
            <span
              className="absolute w-[2px] bg-caret animate-blink rounded-sm"
              style={{
                left: `${currentInput.length * 0.6}em`,
                top: "2px",
                height: "1.3em",
              }}
            />
          )}
          {chars}
          {extraChars}
        </div>
      );
    });
  }, [words, currentWordIndex, currentInput, typedHistory]);

  return (
    <div
      ref={containerRef}
      className={`relative text-2xl leading-relaxed max-h-[7.5rem] overflow-hidden select-none transition-opacity ${
        isFinished ? "opacity-0" : ""
      }`}
    >
      <div className="flex flex-wrap">{renderedWords}</div>
    </div>
  );
};

export default TypingArea;
