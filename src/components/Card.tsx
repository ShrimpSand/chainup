import React from 'react';

interface CardProps {
  suit: '♠' | '♥' | '♣' | '♦';
  number: number;
  onClick?: () => void;
  className?: string;
}

const suitColors = {
  '♠': 'text-blue-600',
  '♥': 'text-red-600',
  '♣': 'text-green-600',
  '♦': 'text-yellow-500'
} as const;

export const Card: React.FC<CardProps> = ({ suit, number, onClick, className = '' }) => {
  const displayNumber = number === 1 ? 'A' : number === 11 ? 'J' : number === 12 ? 'Q' : number === 13 ? 'K' : number;

  return (
    <div
      onClick={onClick}
      className={`w-[19vw] h-[28vw] md:w-32 md:h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer ${className}`}
    >
      <div className={`text-5xl sm:text-7xl ${suitColors[suit]}`}>
        {suit}
      </div>
      <div className={`text-4xl sm:text-6xl font-bold md:mt-2 ${suitColors[suit]}`}>
        {displayNumber}
      </div>
    </div>
  );
}; 