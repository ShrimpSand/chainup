'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PlayArea } from '../components/PlayArea';
import { Hand } from '../components/Hand';
import { RemainingCards } from '../components/RemainingCards';

type Card = {
  id: number;
  suit: '♠' | '♥' | '♣' | '♦';
  number: number;
  position: number;
};

export default function Home() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [playedCards, setPlayedCards] = useState<Card[]>([]);
  const [playedCount, setPlayedCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [lastPlayedCardPosition, setLastPlayedCardPosition] = useState<{ x: number; y: number } | undefined>();

  const initializeDeck = useCallback(() => {
    const suits: ('♠' | '♥' | '♣' | '♦')[] = ['♠', '♥', '♣', '♦'];
    const newDeck: Card[] = [];
    let id = 1;

    suits.forEach(suit => {
      for (let i = 1; i <= 13; i++) {
        newDeck.push({ id: id++, suit, number: i, position: 0 });
      }
    });

    // シャッフル
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  }, []);

  const startNewGame = useCallback(() => {
    const newDeck = initializeDeck();
    const initialHand = newDeck.slice(0, 5).map((card, index) => ({
      ...card,
      position: index
    }));
    setDeck(newDeck.slice(5));
    setHand(initialHand);
    setPlayedCards([]);
    setPlayedCount(0);
    setGameOver(false);
    setIsWin(false);
    setLastPlayedCardPosition(undefined);
  }, [initializeDeck]);

  const getPlayableCards = useCallback(() => {
    if (playedCards.length === 0) return hand.map(card => card.id);
    const lastCard = playedCards[playedCards.length - 1];
    return hand
      .filter(card => 
        card.suit === lastCard.suit || 
        card.number === lastCard.number
      )
      .map(card => card.id);
  }, [hand, playedCards]);

  const playCard = (cardId: number, element?: HTMLElement | null) => {
    const card = hand.find(c => c.id === cardId);
    if (!card) return;

    // カードの位置を計算（要素が存在する場合のみ）
    if (element) {
      const cardRect = element.getBoundingClientRect();
      const playAreaCenter = document.querySelector('.play-area-center')?.getBoundingClientRect();
      
      if (playAreaCenter) {
        setLastPlayedCardPosition({
          x: cardRect.left - playAreaCenter.left,
          y: cardRect.top - playAreaCenter.top
        });
      }
    }

    // 手札から出したカードを削除し、新しいカードを同じ位置に補充
    setPlayedCards(prev => [...prev, card]);
    setPlayedCount(prev => prev + 1);

    if (deck.length > 0) {
      const newCard = { ...deck[0], position: card.position };
      setDeck(prev => prev.slice(1));
      // 一時的に出したカードを削除
      setHand(prev => {
        const newHand = prev.filter(c => c.id !== cardId);
        // 新しいカードを同じ位置に挿入
        return [
          ...newHand.slice(0, card.position),
          newCard,
          ...newHand.slice(card.position)
        ];
      });
    } else {
      setHand(prev => prev.filter(c => c.id !== cardId));
    }
  };

  const checkGameState = useCallback(() => {
    const playableCards = getPlayableCards();
    if (playedCount === 52) {
      setGameOver(true);
      setIsWin(true);
      return;
    }

    if (playableCards.length === 0 && hand.length > 0) {
      setGameOver(true);
      setIsWin(false);
    }
  }, [getPlayableCards, playedCount, hand.length]);

  useEffect(() => {
    const newDeck = initializeDeck();
    const initialHand = newDeck.slice(0, 5).map((card, index) => ({
      ...card,
      position: index
    }));
    setDeck(newDeck.slice(5));
    setHand(initialHand);
  }, [initializeDeck]);

  useEffect(() => {
    if (hand.length > 0) {
      checkGameState();
    }
  }, [hand, playedCards, checkGameState]);

  // Rキーでのリトライ
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver && e.key.toLowerCase() === 'r') {
        startNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, startNewGame]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-2 sm:p-8">
      <div className="relative max-w-4xl mx-auto">
        <RemainingCards playedCards={playedCards} />
        <div className="play-area-center">
          <PlayArea 
            playedCards={playedCards}
            lastPlayedCardPosition={lastPlayedCardPosition}
          />
        </div>
        <Hand
          cards={hand}
          onCardPlay={playCard}
          playableCards={getPlayableCards()}
        />
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-800 bg-white rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isWin ? '勝利！' : 'ゲームオーバー'}
            </h2>
            <p className="mb-4">出したカード: {playedCount}枚</p>
            <button
              onClick={startNewGame}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              リトライ
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
