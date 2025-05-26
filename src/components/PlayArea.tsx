import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

interface PlayAreaProps {
  playedCards: Array<{
    suit: '♠' | '♥' | '♣' | '♦';
    number: number;
  }>;
  lastPlayedCardPosition?: { x: number; y: number };
}

export const PlayArea: React.FC<PlayAreaProps> = ({ playedCards, lastPlayedCardPosition }) => {
  const lastCard = playedCards[playedCards.length - 1];

  return (
    <div className="flex flex-col items-center justify-center h-48">
      <AnimatePresence mode="wait">
        {lastCard ? (
          <motion.div
            key={`${lastCard.suit}-${lastCard.number}`}
            initial={lastPlayedCardPosition ? {
              x: lastPlayedCardPosition.x,
              y: lastPlayedCardPosition.y,
              scale: 1
            } : { scale: 0 }}
            animate={{ x: 0, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut",
              x: { type: "spring", stiffness: 300, damping: 30 },
              y: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <Card suit={lastCard.suit} number={lastCard.number} className="w-24 sm:w-32" />
          </motion.div>
        ) : (
          <div className="w-24 sm:w-32 h-36 sm:h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">場札</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}; 