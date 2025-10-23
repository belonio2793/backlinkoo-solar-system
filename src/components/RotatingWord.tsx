import { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  intervalMs?: number;
  className?: string;
}

export const RotatingWord = ({ words, intervalMs = 3500, className = "" }: RotatingWordProps) => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Ensure index is always valid if words length changes
  useEffect(() => {
    if (index >= words.length) setIndex(0);
  }, [words.length, index]);

  // Use only words.length in deps so parent re-renders with a new array reference don't reset the timer
  useEffect(() => {
    if (!words || words.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 250);
    }, Math.max(1200, intervalMs));

    return () => clearInterval(interval);
  }, [words.length, intervalMs]);

  return (
    <span
      className={`inline-block mx-1 text-primary transition-all duration-300 ${
        isAnimating ? "opacity-0 translate-y-1 scale-95" : "opacity-100 translate-y-0 scale-100"
      } ${className}`}
      aria-live="polite"
    >
      {words[index]}
    </span>
  );
};
