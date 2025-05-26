import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  suit: '♠' | '♥' | '♣' | '♦';
  number: number;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ suit, number, onClick, className = '' }) => {
  const isRed = suit === '♥' || suit === '♦';
  const displayNumber = number === 1 ? 'A' : number === 11 ? 'J' : number === 12 ? 'Q' : number === 13 ? 'K' : number;

  return (
    <div
      onClick={onClick}
      className={`w-[19vw] h-[28vw] md:w-32 md:h-48 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer ${className}`}
    >
      <div className={`text-4xl ${isRed ? 'text-red-500' : 'text-gray-800'}`}>
        {suit}
      </div>
      <div className={`text-4xl font-bold mt-2 ${isRed ? 'text-red-500' : 'text-gray-800'}`}>
        {displayNumber}
      </div>
    </div>
  );
}; 