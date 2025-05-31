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
  const [isEasyMode, setIsEasyMode] = useState(false);

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

  const findMatchingCardFromDeck = useCallback((selectedCard: Card): Card | undefined => {
    if (!isEasyMode) return undefined;
    
    const lastPlayedCard = playedCards[playedCards.length - 1];
    if (!lastPlayedCard) return undefined;

    // 手札にある数字のリストを作成
    const handNumbers = new Set(hand.map(card => card.number));

    // 場のカードと繋がるカードを探す
    const matchingCards = deck.filter(card => 
      card.suit === lastPlayedCard.suit || 
      card.number === lastPlayedCard.number
    );

    if (matchingCards.length === 0) return undefined;

    // 同じマークと異なるマークのカードに分類
    const sameSuitCards = matchingCards.filter(card => card.suit === lastPlayedCard.suit);
    const differentSuitCards = matchingCards.filter(card => 
      card.suit !== lastPlayedCard.suit && 
      card.number === lastPlayedCard.number
    );

    // 60%の確率で同じマーク、40%の確率で異なるマークを選択
    const useSameSuit = Math.random() < 0.6;

    if (useSameSuit && sameSuitCards.length > 0) {
      // 同じマークのカードの中から、手札の数字と同じものを優先
      const sameSuitWithHandNumber = sameSuitCards.filter(card => handNumbers.has(card.number));
      if (sameSuitWithHandNumber.length > 0) {
        return sameSuitWithHandNumber[Math.floor(Math.random() * sameSuitWithHandNumber.length)];
      }
      return sameSuitCards[Math.floor(Math.random() * sameSuitCards.length)];
    } else if (differentSuitCards.length > 0) {
      // 異なるマークのカードの中から、手札の数字と同じものを優先
      const differentSuitWithHandNumber = differentSuitCards.filter(card => handNumbers.has(card.number));
      if (differentSuitWithHandNumber.length > 0) {
        return differentSuitWithHandNumber[Math.floor(Math.random() * differentSuitWithHandNumber.length)];
      }
      return differentSuitCards[Math.floor(Math.random() * differentSuitCards.length)];
    } else if (sameSuitCards.length > 0) {
      // 異なるマークのカードがない場合は同じマークのカードを使用
      return sameSuitCards[Math.floor(Math.random() * sameSuitCards.length)];
    }

    return undefined;
  }, [deck, playedCards, isEasyMode, hand]);

  const playCard = (cardId: number, element?: HTMLElement | null) => {
    const card = hand.find(c => c.id === cardId);
    if (!card) return;

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

    setPlayedCards(prev => [...prev, card]);
    setPlayedCount(prev => prev + 1);

    if (deck.length > 0) {
      let newCard: Card;
      const matchingCard = findMatchingCardFromDeck(card);
      
      if (matchingCard) {
        // イージーモードで適切なカードが見つかった場合
        newCard = { ...matchingCard, position: card.position };
        setDeck(prev => prev.filter(c => c.id !== matchingCard.id));
      } else {
        // 通常のカード補充
        newCard = { ...deck[0], position: card.position };
        setDeck(prev => prev.slice(1));
      }

      setHand(prev => {
        const newHand = prev.filter(c => c.id !== cardId);
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
    
    // ゲームクリアの条件をより詳細に判定
    if (playedCount >= 52 || (playedCards.length === 52) || (deck.length === 0 && hand.length === 0)) {
      console.log('Game Clear Triggered', {
        playedCount,
        playedCardsLength: playedCards.length,
        deckLength: deck.length,
        handLength: hand.length
      });
      setGameOver(true);
      setIsWin(true);
      return;
    }

    // プレイ可能なカードがない場合はゲームオーバー
    if (playableCards.length === 0 && hand.length > 0) {
      console.log('Game Over Triggered', {
        playableCardsLength: playableCards.length,
        handLength: hand.length
      });
      setGameOver(true);
      setIsWin(false);
    }
  }, [getPlayableCards, playedCount, playedCards.length, hand.length, deck.length]);

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
    if (hand !== null) {
      checkGameState();
    }
  }, [hand, playedCards, checkGameState]);

  // Rキーでのリトライ
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 's')) {
        startNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, startNewGame]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 p-2 sm:p-8">
      <div className="relative max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setIsEasyMode(!isEasyMode);
              startNewGame();
            }}
            className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isEasyMode ? 'ノーマルモードに切り替え' : 'イージーモードに切り替え'}
          </button>
          <div className="text-white font-bold">
            現在のモード: {isEasyMode ? 'イージー' : 'ノーマル'}
          </div>
        </div>
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
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-gray-800 bg-white rounded-lg p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">
              {isWin ? '🎉 ゲームクリア！ 🎉' : 'ゲームオーバー'}
            </h2>
            <p className="mb-4">出したカード: {playedCount}枚</p>
            <button
              onClick={startNewGame}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              リトライ <span className="hidden sm:inline">(R or S)</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
