import React from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  in: {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  out: {
    opacity: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
};

const pageTransition: Transition  = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-black"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;