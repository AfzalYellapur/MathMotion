import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import type { ViewType } from './types';

interface ViewTabsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}
export default function ViewTabs({ currentView, onViewChange }: ViewTabsProps) {
  return (
    <MagnifyingToggleButton
      currentView={currentView}
      onViewChange={onViewChange} />
  );
}

const MagnifyingToggleButton = ({
  currentView,
  onViewChange,
}: {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}) => {

  const editorRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const highlightX: MotionValue<number> = useSpring(0, { stiffness: 400, damping: 35 });
  const highlightWidth: MotionValue<number> = useSpring(0, { stiffness: 400, damping: 35 });

  useEffect(() => {
    if (editorRef.current) {
      highlightX.set(editorRef.current.offsetLeft);
      highlightWidth.set(editorRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (currentView === 'editor' && editorRef.current) {
      highlightX.set(editorRef.current.offsetLeft);
      highlightWidth.set(editorRef.current.offsetWidth);
    } else if (currentView === 'preview' && previewRef.current) {
      highlightX.set(previewRef.current.offsetLeft);
      highlightWidth.set(previewRef.current.offsetWidth);
    }
  }, [currentView, highlightX, highlightWidth]);

  return (
    <div
      className="relative flex items-center p-1 bg-[#1e1e1e] rounded-full"
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-y-0 left-0 my-auto h-[85%] rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)] backdrop-blur-sm"
        style={{
          x: highlightX,
          width: highlightWidth,
        }}
      />

      <button
        ref={editorRef}
        onClick={() => onViewChange('editor')}
        className="relative z-10 px-4.5 py-0.5 font-semibold"
      >
        <TextMagnifier
          text="Code"
          highlightX={highlightX}
          highlightWidth={highlightWidth}
          containerRef={containerRef}
        />
      </button>

      <button
        ref={previewRef}
        onClick={() => onViewChange('preview')}
        className="relative z-10 px-4.5 py-0.5 font-semibold"
      >
        <TextMagnifier
          text="Preview"
          highlightX={highlightX}
          highlightWidth={highlightWidth}
          containerRef={containerRef}
        />
      </button>
    </div>
  );
};

const TextMagnifier = ({
  text,
  highlightX,
  highlightWidth,
  containerRef,
}: {
  text: string;
  highlightX: MotionValue<number>;
  highlightWidth: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <span className="flex items-center">
      {text.split('').map((char, index) => (
        <Character
          key={index}
          char={char}
          highlightX={highlightX}
          highlightWidth={highlightWidth}
          containerRef={containerRef}
        />
      ))}
    </span>
  );
};

const Character = ({
  char,
  highlightX,
  highlightWidth,
  containerRef,
}: {
  char: string;
  highlightX: MotionValue<number>;
  highlightWidth: MotionValue<number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const charRef = useRef<HTMLSpanElement>(null);
  const [charBounds, setCharBounds] = useState({ left: 0, width: 0 });

  const updateCharPosition = () => {
    if (charRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const charRect = charRef.current.getBoundingClientRect();
      setCharBounds({
        left: charRect.left - containerRect.left,
        width: charRect.width,
      });
    }
  };

  useEffect(() => {
    updateCharPosition();
    window.addEventListener('resize', updateCharPosition);
    return () => {
      window.removeEventListener('resize', updateCharPosition);
    };
  }, [containerRef]);

  const isUnderHighlight = useTransform(
    [highlightX, highlightWidth],
    (values) => {
      const [hX, hW] = values as [number, number];
      const highlightStart = hX;
      const highlightEnd = hX + hW;
      const charStart = charBounds.left;
      const charEnd = charBounds.left + charBounds.width;

      const isOverlapping = charStart < highlightEnd && charEnd > highlightStart;
      return isOverlapping ? 1 : 0;
    }
  );


  const smoothIsUnder = useSpring(0, { stiffness: 500, damping: 40 });

  useEffect(() => {
    const unsubscribe = isUnderHighlight.on("change", (latest) => {
      smoothIsUnder.set(latest);
    });
    return () => unsubscribe();
  }, [isUnderHighlight, smoothIsUnder]);

  const scale = useTransform(smoothIsUnder, [0, 1], [1, 1.2]);
  const color = useTransform(smoothIsUnder, [0, 1], ["rgb(161 161 170)", "rgb(255 255 255)"]);

  return (
    <motion.span
      ref={charRef}
      style={{ scale, color }}
      className="inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};
