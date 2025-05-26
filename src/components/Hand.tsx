import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

interface HandProps {
  cards: Array<{
    id: number;
    suit: '♠' | '♥' | '♣' | '♦';
    number: number;
    position: number;
  }>;
  onCardPlay: (cardId: number, element?: HTMLElement | null) => void;
  playableCards: number[];
}

const keyMap = ['d', 'f', 'j', 'k', 'l'];
const numKeys = ['1', '2', '3', '4', '5'];

export const Hand: React.FC<HandProps> = ({ cards, onCardPlay, playableCards }) => {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyIndex = keyMap.indexOf(e.key.toLowerCase());
      const numIndex = numKeys.indexOf(e.key);
      const index = keyIndex !== -1 ? keyIndex : numIndex;
      
      if (index !== -1 && cards[index] && playableCards.includes(cards[index].id)) {
        onCardPlay(cards[index].id, cardRefs.current[index]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cards, playableCards, onCardPlay]);

  return (
    <div className="flex justify-center mt-8">
      <div className="relative flex justify-center gap-1 md:gap-4 max-w-full">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const isPlayable = playableCards.includes(card.id);
            return (
              <div 
                key={`hand-${card.id}`}
                className="flex flex-col items-center" 
                ref={el => {
                  if (el) cardRefs.current[index] = el;
                }}
              >
                <motion.div
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 720, opacity: 1 }}
                  exit={{ y: -200, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ perspective: 1000 }}
                  onClick={() => isPlayable && onCardPlay(card.id, cardRefs.current[index])}
                >
                  <Card
                    suit={card.suit}
                    number={card.number}
                    className={`${isPlayable ? 'border-4 border-blue-400 hover:scale-110' : ''} transition-transform w-24 sm:w-32`}
                  />
                </motion.div>
                <div className="hidden sm:block mt-2 text-white font-bold text-lg">
                  {keyMap[index].toUpperCase()}/{numKeys[index]}
                </div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}; 