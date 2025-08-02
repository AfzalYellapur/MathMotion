import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface GlassyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

function GlassyButton({ children, onClick, disabled }: GlassyButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative flex items-center justify-center bg-[#1e1e1e] rounded-full"
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        className="absolute inset-0 h-full w-full rounded-full border border-white/20 bg-gradient-to-b from-white/15 to-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)] backdrop-blur-sm"        
      
                    />
                )}
            </AnimatePresence>
            <div className="relative z-10 px-5 py-1.5 font-semibold">
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

export default React.memo(GlassyButton);