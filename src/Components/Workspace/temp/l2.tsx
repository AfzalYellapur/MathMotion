import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    </>
  );
}

// --- Full-Screen Glassy Loading Component ---

const GlassyLoadingScreen = ({ isLoading}: { isLoading: boolean}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-md border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
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


