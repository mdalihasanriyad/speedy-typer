import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  typedHistory: string[];
  isFinished: boolean;
  isRunning: boolean;
}

const TypingArea = ({ words, currentWordIndex, currentInput, typedHistory, isFinished, isRunning }: TypingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ left: 0, top: 0 });
  const [lineHeight, setLineHeight] = useState(0);
  const [fontReady, setFontReady] = useState(false);
  // Tick bumps whenever fonts finish loading so measurement effects re-run
  // with the final glyph metrics, preventing caret/character jitter.
  const [fontTick, setFontTick] = useState(0);

  // Wait for Roboto Mono to be fully loaded before revealing the typing area.
  // Until then we keep the layout reserved but invisible, so the caret and
  // characters render in their final positions on first paint.
  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (!fonts) {
      setFontReady(true);
      return;
    }

    let cancelled = false;
    const markReady = () => {
      if (cancelled) return;
      setFontReady(true);
      setFontTick((t) => t + 1);
    };

    // Explicitly request the exact face we care about so we don't wait on
    // unrelated fonts elsewhere on the page.
    Promise.all([
      fonts.load('1em "Roboto Mono"').catch(() => undefined),
      fonts.load('600 1em "Roboto Mono"').catch(() => undefined),
      fonts.ready.catch(() => undefined),
    ]).then(markReady);

    return () => {
      cancelled = true;
    };
  }, []);

  // Measure the actual line height of a word element. Recomputes on window
  // resize and whenever the container itself resizes (font-size changes,
  // container width changes, zoom, etc.).
  useLayoutEffect(() => {
    const measure = () => {
      const el = activeWordRef.current ?? containerRef.current?.querySelector<HTMLDivElement>("div[class*='inline-block']");
      if (el) {
        const h = el.getBoundingClientRect().height;
        if (h > 0) setLineHeight(h);
      }
    };
    measure();

    window.addEventListener("resize", measure);
    let ro: ResizeObserver | undefined;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(containerRef.current);
    }
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [fontTick]);

  // Scroll when active word moves to a new line
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const word = activeWordRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const wordTop = word.getBoundingClientRect().top;
      const offset = wordTop - containerTop;
      // Use the cached measured line height (recomputed on resize), falling
      // back to a fresh measurement if it hasn't been captured yet.
      const lh = lineHeight || word.getBoundingClientRect().height;
      // Trigger when the active word is on the 3rd visible line or beyond,
      // then scroll so it sits on the 2nd line.
      if (offset > lh * 2) {
        container.scrollTop += offset - lh;
      }
    }
  }, [currentWordIndex, lineHeight]);

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
  }, [currentWordIndex, currentInput, fontTick]);

  const renderedWords = useMemo(() => {
    return words.map((word, wIdx) => {
      const isActive = wIdx === currentWordIndex;
      const isTyped = wIdx < currentWordIndex;
      const typedWord = isTyped ? typedHistory[wIdx] : isActive ? currentInput : "";

      const chars = word.split("").map((char, cIdx) => {
        let className = "text-foreground";

        if (isTyped || isActive) {
          if (cIdx < typedWord.length) {
            if (typedWord[cIdx] === char) {
              className = isActive ? "char-flash-correct" : "text-text-correct";
            } else {
              className = isActive ? "char-shake-incorrect" : "text-text-incorrect";
            }
          } else if (isTyped) {
            className = "text-text-incorrect opacity-60";
          } else if (isActive && cIdx === typedWord.length) {
            className = "text-foreground underline decoration-primary decoration-2 underline-offset-4";
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
          className="inline-block mr-[0.75em] mb-1 relative"
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
      className={`relative font-mono text-[1.875rem] leading-[3.5rem] max-h-[10.5rem] overflow-hidden select-none transition-opacity duration-200 ${
        isFinished || !fontReady ? "opacity-0" : "opacity-100"
      }`}
      style={{
        // Smooth, consistent glyph rendering across browsers so characters
        // don't visibly re-rasterize as the font swaps in.
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        textRendering: "geometricPrecision",
        fontVariantLigatures: "none",
        fontKerning: "none",
      }}
    >
      {/* Smooth caret */}
      <div
        ref={caretRef}
        className={`absolute w-[2.5px] rounded-sm pointer-events-none z-10 ${!isRunning ? "animate-caret-blink" : ""}`}
        style={{
          height: "1.4em",
          left: `${caretPos.left}px`,
          top: `${caretPos.top}px`,
          transition: fontReady
            ? "left 80ms ease-out, top 80ms ease-out, opacity 120ms ease-out"
            : "none",
          opacity: fontReady ? 1 : 0,
          willChange: "left, top",
          background: "hsl(var(--caret))",
          boxShadow: "0 0 8px 2px hsl(var(--caret) / 0.4), 0 0 2px 0 hsl(var(--caret) / 0.6)",
        }}
      />
      <div className="flex flex-wrap">{renderedWords}</div>
    </div>
  );
};

export default TypingArea;
