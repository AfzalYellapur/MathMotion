import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// The main App component to display and center the buttons
export default function App() {
  // State to control the loading screen's visibility
  const [isLoading, setIsLoading] = useState(true);

  // Simulate a loading process on component mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlassyLoadingScreen isLoading={isLoading} />
      <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center gap-8 font-sans">
        <MagnifyingToggleButton />
        <GlassyButton>Submit</GlassyButton>
      </div>
    </>
  );
}

// --- Full-Screen Glassy Loading Component ---

const GlassyLoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
        >
          {/* The spinning loader */}
          <motion.div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '4px solid rgba(255, 255, 255, 0.1)',
              borderTopColor: 'rgba(255, 255, 255, 0.8)',
            }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: 'linear',
            }}
          />
          {/* Animated loading text */}
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mt-4 text-lg font-semibold text-white/80"
          >
            Loading...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Standalone Glassy Button Component (Updated Logic) ---

const GlassyButton = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex items-center justify-center p-1 bg-zinc-800 rounded-full"
    >
      {/* The 3D glassy background effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="absolute inset-0 h-full w-full rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      
      {/* Container for the text, now passing down the simple hover state */}
      <div className="relative z-10 px-8 py-2 text-lg font-semibold">
        <ButtonTextMagnifier text={children as string} isHovered={isHovered} />
      </div>
    </motion.button>
  );
};

// Dedicated Text component for the GlassyButton
const ButtonTextMagnifier = ({ text, isHovered }: { text: string; isHovered: boolean; }) => {
  return (
    <span className="flex items-center">
      {text.split('').map((char, index) => (
        <ButtonCharacter key={index} char={char} isHovered={isHovered} />
      ))}
    </span>
  );
};

// Dedicated Character component for the GlassyButton, now with corrected animation trigger
const ButtonCharacter = ({ char, isHovered }: { char: string; isHovered: boolean; }) => {
  // Create the spring motion value once.
  const isUnderHighlight = useSpring(0, { stiffness: 500, damping: 40 });
  
  // Use an effect to update the spring's value when `isHovered` changes.
  useEffect(() => {
    isUnderHighlight.set(isHovered ? 1 : 0);
  }, [isHovered, isUnderHighlight]);

  // Map the spring value to scale and color
  const scale = useTransform(isUnderHighlight, [0, 1], [1, 1.2]);
  const color = useTransform(isUnderHighlight, [0, 1], ["rgb(161 161 170)", "rgb(255 255 255)"]);

  return (
    <motion.span style={{ scale, color }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};


// --- Magnifying Toggle Button Component (Unchanged) ---

const MagnifyingToggleButton = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const editorRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightX = useSpring(0, { stiffness: 400, damping: 35 });
  const highlightWidth = useSpring(0, { stiffness: 400, damping: 35 });

  useEffect(() => {
    if (editorRef.current) {
      highlightX.set(editorRef.current.offsetLeft);
      highlightWidth.set(editorRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'editor' && editorRef.current) {
      highlightX.set(editorRef.current.offsetLeft);
      highlightWidth.set(editorRef.current.offsetWidth);
    } else if (activeTab === 'preview' && previewRef.current) {
      highlightX.set(previewRef.current.offsetLeft);
      highlightWidth.set(previewRef.current.offsetWidth);
    }
  }, [activeTab, highlightX, highlightWidth]);

  return (
    <div className="relative flex items-center p-1 bg-zinc-800 rounded-full" ref={containerRef}>
      <motion.div
        className="absolute inset-y-0 left-0 my-auto h-[85%] rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)] backdrop-blur-sm"
        style={{ x: highlightX, width: highlightWidth }}
      />
      <button ref={editorRef} onClick={() => setActiveTab('editor')} className="relative z-10 px-5 py-1.5 text-lg font-semibold">
        <ToggleTextMagnifier text="Editor" highlightX={highlightX} highlightWidth={highlightWidth} containerRef={containerRef} />
      </button>
      <button ref={previewRef} onClick={() => setActiveTab('preview')} className="relative z-10 px-5 py-1.5 text-lg font-semibold">
        <ToggleTextMagnifier text="Preview" highlightX={highlightX} highlightWidth={highlightWidth} containerRef={containerRef} />
      </button>
    </div>
  );
};

// Dedicated Text component for the Toggle Button
const ToggleTextMagnifier = ({ text, highlightX, highlightWidth, containerRef }: { text: string; highlightX: any; highlightWidth: any; containerRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <span className="flex items-center">
      {text.split('').map((char, index) => (
        <ToggleCharacter key={index} char={char} highlightX={highlightX} highlightWidth={highlightWidth} containerRef={containerRef} />
      ))}
    </span>
  );
};

// Dedicated Character component for the Toggle Button
const ToggleCharacter = ({ char, highlightX, highlightWidth, containerRef }: { char: string; highlightX: any; highlightWidth: any; containerRef: React.RefObject<HTMLDivElement> }) => {
  const charRef = useRef<HTMLSpanElement>(null);
  const [charBounds, setCharBounds] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateCharPosition = () => {
      if (charRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const charRect = charRef.current.getBoundingClientRect();
        setCharBounds({ left: charRect.left - containerRect.left, width: charRect.width });
      }
    };
    updateCharPosition();
    window.addEventListener('resize', updateCharPosition);
    return () => window.removeEventListener('resize', updateCharPosition);
  }, [containerRef]);

  const isUnderHighlight = useTransform(
    [highlightX, highlightWidth],
    ([hX, hW]) => {
      const isOverlapping = charBounds.left < hX + hW && charBounds.left + charBounds.width > hX;
      return isOverlapping ? 1 : 0;
    }
  );

  const smoothIsUnder = useSpring(isUnderHighlight, { stiffness: 500, damping: 40 });
  const scale = useTransform(smoothIsUnder, [0, 1], [1, 1.2]);
  const color = useTransform(smoothIsUnder, [0, 1], ["rgb(161 161 170)", "rgb(255 255 255)"]);

  return (
    <motion.span ref={charRef} style={{ scale, color }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};
