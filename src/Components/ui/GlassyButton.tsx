import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface GlassyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    background?: string;
}


function GlassyButton({ children, onClick, disabled, background }: GlassyButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const isTextNode = typeof children === 'string';

    // Animation logic for non-text children (icons)
    const iconSpring = useSpring(0, { stiffness: 500, damping: 40 });
    useEffect(() => {
        iconSpring.set(isHovered ? 1 : 0);
    }, [isHovered, iconSpring]);

    const iconScale = useTransform(iconSpring, [0, 1], [1, 1.2]);
    // Animate the color property, which will be inherited by the SVG's stroke
    const iconColor = useTransform(iconSpring, [0, 1], ["rgb(161 161 170)", "rgb(255 255 255)"]);

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative flex items-center justify-center ${background} rounded-full ${disabled && "cursor-not-allowed"} `}
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
            <div className={`relative z-10 ${isTextNode ? ("px-5 py-1.5"):("p-2")} font-semibold`}>
                {isTextNode ? (
                    <ButtonTextMagnifier text={children as string} isHovered={isHovered} />
                ) : (
                    <motion.div style={{ scale: iconScale, color: iconColor }} className="flex items-center justify-center">
                        {children}
                    </motion.div>
                )}
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