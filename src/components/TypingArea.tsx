import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
  const caretRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0 });

  // Scroll when active word moves to a new line
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

  // Update caret position based on the active word's character spans
  useLayoutEffect(() => {
    if (!activeWordRef.current || !containerRef.current) return;

    const wordEl = activeWordRef.current;
    const containerEl = containerRef.current;
    const containerRect = containerEl.getBoundingClientRect();
    const charSpans = wordEl.querySelectorAll<HTMLSpanElement>("span[data-char]");
    const charIndex = currentInput.length;

    let left: number;
    let top: number;

    if (charIndex === 0) {
      // Before first character — position at the start of the word
      const wordRect = wordEl.getBoundingClientRect();
      left = wordRect.left - containerRect.left + containerEl.scrollLeft;
      top = wordRect.top - containerRect.top + containerEl.scrollTop + 2;
    } else if (charIndex <= charSpans.length) {
      // After a typed character
      const span = charSpans[charIndex - 1];
      const rect = span.getBoundingClientRect();
      left = rect.right - containerRect.left + containerEl.scrollLeft;
      top = rect.top - containerRect.top + containerEl.scrollTop + 2;
    } else {
      // Extra characters beyond word length — use extra spans
      const extraSpans = wordEl.querySelectorAll<HTMLSpanElement>("span[data-extra]");
      const extraIndex = charIndex - charSpans.length - 1;
      if (extraSpans.length > 0 && extraIndex < extraSpans.length) {
        const span = extraSpans[extraIndex];
        const rect = span.getBoundingClientRect();
        left = rect.right - containerRect.left + containerEl.scrollLeft;
        top = rect.top - containerRect.top + containerEl.scrollTop + 2;
      } else if (charSpans.length > 0) {
        const lastSpan = charSpans[charSpans.length - 1];
        const rect = lastSpan.getBoundingClientRect();
        left = rect.right - containerRect.left + containerEl.scrollLeft;
        top = rect.top - containerRect.top + containerEl.scrollTop + 2;
      } else {
        const wordRect = wordEl.getBoundingClientRect();
        left = wordRect.left - containerRect.left + containerEl.scrollLeft;
        top = wordRect.top - containerRect.top + containerEl.scrollTop + 2;
      }
    }

    setCaretPos({ left, top });
  }, [currentWordIndex, currentInput]);

  const renderedWords = useMemo(() => {
    return words.map((word, wIdx) => {
      const isActive = wIdx === currentWordIndex;
      const isTyped = wIdx < currentWordIndex;
      const typedWord = isTyped ? typedHistory[wIdx] : isActive ? currentInput : "";

      const chars = word.split("").map((char, cIdx) => {
        let className = "text-foreground";

        if (isTyped || isActive) {
          if (cIdx < typedWord.length) {
            className = typedWord[cIdx] === char ? "text-text-correct" : "text-text-incorrect";
          } else if (isTyped) {
            className = "text-text-incorrect opacity-60";
          }
        }

        return (
          <span key={cIdx} data-char className={className}>
            {char}
          </span>
        );
      });

      const extraChars =
        typedWord.length > word.length
          ? typedWord
              .slice(word.length)
              .split("")
              .map((ch, i) => (
                <span key={`extra-${i}`} data-extra className="text-text-extra">
                  {ch}
                </span>
              ))
          : null;

      return (
        <div
          key={wIdx}
          ref={isActive ? activeWordRef : undefined}
          className="inline-block mr-[10px] mb-1 relative"
        >
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
      {/* Smooth caret */}
      <div
        ref={caretRef}
        className="absolute w-[2.5px] bg-caret rounded-sm pointer-events-none z-10"
        style={{
          height: "1.4em",
          left: `${caretPos.left}px`,
          top: `${caretPos.top}px`,
          transition: "left 80ms ease-out, top 80ms ease-out",
        }}
      />
      <div className="flex flex-wrap">{renderedWords}</div>
    </div>
  );
};

export default TypingArea;
