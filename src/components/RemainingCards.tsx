import React from 'react';

interface RemainingCardsProps {
  playedCards: Array<{
    suit: '♠' | '♥' | '♣' | '♦';
    number: number;
  }>;
}

const suits = ['♠', '♥', '♣', '♦'] as const;
const suitColors = {
  '♠': 'text-blue-600',
  '♥': 'text-red-600',
  '♣': 'text-green-600',
  '♦': 'text-yellow-500'
};

export const RemainingCards: React.FC<RemainingCardsProps> = ({ playedCards }) => {
  const getDisplayNumber = (num: number) => {
    return num === 1 ? 'A' : num === 11 ? 'J' : num === 12 ? 'Q' : num === 13 ? 'K' : num;
  };

  const isCardPlayed = (suit: string, number: number) => {
    return playedCards.some(card => card.suit === suit && card.number === number);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="bg-gray-200 rounded-lg p-4">
        <table className="w-full">
          <tbody>
            {suits.map(suit => (
              <tr key={suit} className="border-b border-gray-300 last:border-none">
                <td className={`${suitColors[suit]} text-md md:text-4xl p-1 md:p-2`}>{suit}</td>
                {Array.from({ length: 13 }, (_, i) => i + 1).map(num => (
                  <td key={num} className="p-1 md:p-2 text-center">
                    {!isCardPlayed(suit, num) && (
                      <span className="text-gray-800 text-md md:text-2xl">
                        {getDisplayNumber(num)}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 