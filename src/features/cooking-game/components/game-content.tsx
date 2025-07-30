
import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  pointerWithin
} from '@dnd-kit/core';
import type { 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent
} from '@dnd-kit/core';
import { useGameContext, vegetableShapes, type VegetablePiece } from './game-provider.tsx';
import { GameBoard } from './game-board.tsx';
import { NextPiece } from './next-piece.tsx';
import { Score } from './score.tsx';
import { DraggedPiece } from './dragged-piece.tsx';
import styles from './game-content.module.css';

// Константы
const BOARD_SIZE = 8;
const POINTS_PER_LINE = 100;
const MAGNETIC_THRESHOLD = 0.3; // Порог для магнитного притяжения (30% от размера ячейки)

export function GameContent() {
  const { state, dispatch } = useGameContext();
  const [draggedPiece, setDraggedPiece] = useState<VegetablePiece | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ row: number; col: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isValidPreviewPosition, setIsValidPreviewPosition] = useState<boolean>(true);

  // Улучшенная функция для получения оптимальной позиции размещения
  const getOptimalPosition = (piece: VegetablePiece, targetRow: number, targetCol: number, mouseOffset?: { x: number; y: number }) => {
    const pieceHeight = piece.shape.length;
    const pieceWidth = piece.shape[0].length;
    
    let optimalRow = targetRow;
    let optimalCol = targetCol;
    
    // Если есть смещение мыши, учитываем его для более точного позиционирования
    if (mouseOffset) {
      const cellSize = window.innerWidth <= 480 ? 25 : window.innerWidth <= 768 ? 28 : 35;
      const offsetRow = Math.round(mouseOffset.y / cellSize);
      const offsetCol = Math.round(mouseOffset.x / cellSize);
      
      optimalRow = targetRow + offsetRow;
      optimalCol = targetCol + offsetCol;
    }
    
    // Центрируем фигуру относительно оптимальной позиции
    const centerRow = optimalRow - Math.floor(pieceHeight / 2);
    const centerCol = optimalCol - Math.floor(pieceWidth / 2);
    
    // Ограничиваем позицию границами поля
    const clampedRow = Math.max(0, Math.min(BOARD_SIZE - pieceHeight, centerRow));
    const clampedCol = Math.max(0, Math.min(BOARD_SIZE - pieceWidth, centerCol));
    
    return { row: clampedRow, col: clampedCol };
  };

  // Функция магнитного притяжения к валидным позициям
  const findNearestValidPosition = (piece: VegetablePiece, targetRow: number, targetCol: number) => {
    const pieceHeight = piece.shape.length;
    const pieceWidth = piece.shape[0].length;
    
    // Проверяем текущую позицию
    if (canPlacePiece(piece, targetRow, targetCol)) {
      return { row: targetRow, col: targetCol };
    }
    
    // Ищем ближайшую валидную позицию в радиусе 2 ячеек
    const searchRadius = 2;
    let bestPosition: { row: number; col: number } | null = null;
    let bestDistance = Infinity;
    
    for (let r = Math.max(0, targetRow - searchRadius); r <= Math.min(BOARD_SIZE - pieceHeight, targetRow + searchRadius); r++) {
      for (let c = Math.max(0, targetCol - searchRadius); c <= Math.min(BOARD_SIZE - pieceWidth, targetCol + searchRadius); c++) {
        // Дополнительная проверка границ
        if (r < 0 || r + pieceHeight > BOARD_SIZE || c < 0 || c + pieceWidth > BOARD_SIZE) {
          continue;
        }
        
        if (canPlacePiece(piece, r, c)) {
          const distance = Math.sqrt((r - targetRow) ** 2 + (c - targetCol) ** 2);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestPosition = { row: r, col: c };
          }
        }
      }
    }
    
    // Если не найдена валидная позиция, возвращаем исходную позицию
    return bestPosition || { row: targetRow, col: targetCol };
  };

  // Проверка возможности размещения фигуры
  const canPlacePiece = (piece: VegetablePiece, row: number, col: number): boolean => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newRow = row + r;
          const newCol = col + c;
          
          if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
            return false;
          }
          
          if (state.board[newRow][newCol] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Размещение фигуры на поле
  const placePiece = (piece: VegetablePiece, row: number, col: number): boolean => {
    // Проверяем возможность размещения в указанной позиции
    if (!canPlacePiece(piece, row, col)) {
      return false;
    }

    const newBoard = state.board.map(row => [...row]);
    
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          newBoard[row + r][col + c] = piece;
        }
      }
    }

    dispatch({ type: 'PLACE_PIECE', payload: { board: newBoard } });
    checkLines(newBoard);
    return true;
  };

  // Проверка и очистка заполненных линий
  const checkLines = (board: (VegetablePiece | null)[][]) => {
    let linesCleared = 0;
    let newBoard = board.map(row => [...row]);

    // Проверка строк
    for (let row = 0; row < BOARD_SIZE; row++) {
      if (newBoard[row].every(cell => cell !== null)) {
        newBoard[row] = Array(BOARD_SIZE).fill(null);
        linesCleared++;
      }
    }

    // Проверка столбцов
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard.every(row => row[col] !== null)) {
        for (let row = 0; row < BOARD_SIZE; row++) {
          newBoard[row][col] = null;
        }
        linesCleared++;
      }
    }

    if (linesCleared > 0) {
      const points = linesCleared * POINTS_PER_LINE * state.level;
      dispatch({ 
        type: 'CLEAR_LINES', 
        payload: { board: newBoard, points } 
      });
    }

    checkGameOver(newBoard);
  };

  // Проверка окончания игры
  const checkGameOver = (board: (VegetablePiece | null)[][]) => {
    for (const piece of vegetableShapes) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (canPlacePiece(piece, row, col)) {
            return; // Игра может продолжаться
          }
        }
      }
    }
    
    dispatch({ type: 'GAME_OVER' });
  };

  // Обработка drop фигуры на поле
  const handlePieceDrop = (piece: VegetablePiece, row: number, col: number): boolean => {
    if (state.isGameOver) {
      return false;
    }

    const success = placePiece(piece, row, col);
    
    if (success) {
      // Отправляем событие для удаления фигуры из NextPiece
      document.dispatchEvent(new CustomEvent('piecePlaced', { detail: piece }));
    }
    
    return success;
  };

  // Обработка начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const pieceData = active.data.current as VegetablePiece;
    
    if (pieceData) {
      setDraggedPiece(pieceData);
    }
  };

  // Обработка перетаскивания над полем
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active) return;
    
    const pieceData = active.data.current as VegetablePiece;
    if (!pieceData) return;
    
    const overId = over.id as string;
    if (overId.startsWith('cell-')) {
      const [, rowStr, colStr] = overId.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);
      
      if (!isNaN(row) && !isNaN(col)) {
        // Проверяем, что ячейка не занята
        if (state.board[row][col] !== null) {
          return;
        }
        
        // Получаем оптимальную позицию для предварительного просмотра
        const optimalPosition = getOptimalPosition(pieceData, row, col, dragOffset || undefined);
        
        // Находим ближайшую валидную позицию для предварительного просмотра
        const validPosition = findNearestValidPosition(pieceData, optimalPosition.row, optimalPosition.col);
        setPreviewPosition(validPosition);
        
        // Проверяем валидность позиции
        const isValid = canPlacePiece(pieceData, validPosition.row, validPosition.col);
        setIsValidPreviewPosition(isValid);
      }
    }
  };

  // Обработка окончания перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      resetDragState();
      return;
    }
    
    const pieceData = active.data.current as VegetablePiece;
    if (!pieceData) return;
    
    const overId = over.id as string;
    if (overId.startsWith('cell-')) {
      const [, rowStr, colStr] = overId.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);
      
      if (!isNaN(row) && !isNaN(col)) {
        // Проверяем, что ячейка не занята
        if (state.board[row][col] !== null) {
          resetDragState();
          return;
        }
        
        // Используем ту же логику, что и в handleDragOver для консистентности
        const optimalPosition = getOptimalPosition(pieceData, row, col, dragOffset || undefined);
        const validPosition = findNearestValidPosition(pieceData, optimalPosition.row, optimalPosition.col);
        
        // Проверяем, что позиция действительно валидна перед размещением
        if (canPlacePiece(pieceData, validPosition.row, validPosition.col)) {
          handlePieceDrop(pieceData, validPosition.row, validPosition.col);
        }
      }
    }
    
    resetDragState();
  };

  // Сброс состояния перетаскивания
  const resetDragState = () => {
    setDraggedPiece(null);
    setPreviewPosition(null);
    setDragOffset(null);
    setIsValidPreviewPosition(true);
  };

  // Перезапуск игры
  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.gameContainer}>
        
        
        <div className={styles.gameArea}>
          <div className={styles.gameBoardSection}>
            <GameBoard 
              board={state.board} 
              onPieceDrop={handlePieceDrop}
              previewPosition={previewPosition}
              previewPiece={draggedPiece}
              isValidPosition={isValidPreviewPosition}
              isGameOver={state.isGameOver}
            />
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.nextPiecesSection}>
              <NextPiece />
            </div>
            
            <div className={styles.scoreSection}>
              <Score score={state.score} level={state.level} />
              <div className={styles.actionButtons}>
                <button className={styles.actionButton} title="Магазин">
                  💰
                </button>
                <button className={styles.actionButton} title="Книга">
                  📖
                </button>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {draggedPiece && (
            <DraggedPiece 
              piece={draggedPiece}
            />
          )}
        </DragOverlay>
        
        {state.isGameOver && (
          <div className={styles.gameOver}>
            <h3>Игра окончена!</h3>
            <p>Ваш счет: {state.score}</p>
            <button onClick={handleRestart}>Играть снова</button>
          </div>
        )}
      </div>
    </DndContext>
  );
} 