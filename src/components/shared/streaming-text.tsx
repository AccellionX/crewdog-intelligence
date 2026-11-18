"use client";

import { useEffect, useState } from "react";

export function StreamingText({
  text,
  speed = 12,
  onDone,
  className,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, onDone]);

  return (
    <div className={className}>
      {shown}
      {shown.length < text.length && <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-amber-400" />}
    </div>
  );
}
