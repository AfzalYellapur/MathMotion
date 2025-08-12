import React, { useState, useEffect } from 'react';

interface LEDMatrixProps {
  gap?: number;
  accentColor?: string;
  secondaryColor?: string;
  accentAmount?: number;
  speed?: number;
  size?: number;
  className?: string;
}

const LEDMatrix: React.FC<LEDMatrixProps> = ({
  gap = 4,
  accentColor = '#0080FF',
  secondaryColor = '#161819',
  accentAmount = 0.2,
  speed = 300,
  size = 12,
  className = ''
}) => {
  const [gridData, setGridData] = useState<boolean[]>([]);
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const calculateGrid = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const totalCellWidth = size + gap;
      const cols = Math.floor(containerWidth / totalCellWidth);
      const rows = Math.floor(containerHeight / totalCellWidth);
      
      setDimensions({ cols, rows });
      
      // Initialize grid with random accent cells
      const totalCells = cols * rows;
      const numAccentCells = Math.floor((accentAmount / 10) * totalCells);
      const newGrid = new Array(totalCells).fill(false);
      
      // Randomly place accent cells
      for (let i = 0; i < numAccentCells; i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * totalCells);
        } while (newGrid[randomIndex]);
        newGrid[randomIndex] = true;
      }
      
      setGridData(newGrid);
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, [gap, size, accentAmount]);

  useEffect(() => {
    if (speed === 0 || gridData.length === 0) return;

    const animateRandomly = () => {
      // Randomly pick a few LEDs to change
      setGridData(prevGrid => {
        const newGrid = [...prevGrid];
        const totalCells = newGrid.length;
        
        // Change random number of LEDs (1-5 at a time)
        const numChanges = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < numChanges; i++) {
          const randomIndex = Math.floor(Math.random() * totalCells);
          
          if (newGrid[randomIndex]) {
            // Turn off an accent LED
            newGrid[randomIndex] = false;
          } else {
            // Maybe turn on a new LED (20% chance)
            if (Math.random() < 0.2) {
              newGrid[randomIndex] = true;
            }
          }
        }
        
        return newGrid;
      });
      
      // Schedule next random change with variable timing
      const nextDelay = speed;
      setTimeout(animateRandomly, nextDelay);
    };

    // Start the random animation
    const timeout = setTimeout(animateRandomly, Math.random() * 1000);
    
    return () => clearTimeout(timeout);
  }, [speed, gridData.length]);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${dimensions.cols}, ${size}px)`,
    gap: `${gap}px`,
    padding: `${gap}px`,
    backgroundColor: '#000000',
    minHeight: '100vh',
    minWidth: '100vw',
  };

  const cellStyle = (isAccent: boolean) => ({
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: isAccent ? accentColor : secondaryColor,
    borderRadius: '0px', // Square shape as per Framer settings
  });

  return (
    <div className={`fixed -z-10 inset-0 overflow-hidden ${className}`}>
      <div style={gridStyle}>
        {gridData.map((isAccent, index) => (
          <div
            key={index}
            style={cellStyle(isAccent)}
            className="transition-colors duration-200"
          />
        ))}
      </div>
    </div>
  );
};


export default LEDMatrix;