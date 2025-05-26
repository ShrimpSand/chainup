import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  suit: '♠' | '♥' | '♣' | '♦';
  number: number;
  onClick?: () => void;
  className?: string;
  animate?: any;
  initial?: any;
  transition?: any;
}

const suitColors = {
  '♠': 'text-blue-600',
  '♥': 'text-red-600',
  '♣': 'text-green-600',
  '♦': 'text-yellow-500'
};

export const Card: React.FC<CardProps> = ({
  suit,
  number,
  onClick,
  className = '',
  animate,
  initial,
  transition
}) => {
  const displayNumber = number === 1 ? 'A' : number === 11 ? 'J' : number === 12 ? 'Q' : number === 13 ? 'K' : number;

  return (
    <motion.div
      className={`w-[17vw] max-w-32 h-[24vw] max-h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      <div className={`text-4xl sm:text-5xl sm:mb-2 ${suitColors[suit]}`}>{suit}</div>
      <div className={`text-3xl sm:text-4xl font-bold ${suitColors[suit]}`}>{displayNumber}</div>
    </motion.div>
  );
}; 