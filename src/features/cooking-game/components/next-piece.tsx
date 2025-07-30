import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { type VegetablePiece, vegetableShapes } from './game-provider.tsx';
import { getVegetableImagePath } from '../../../utils/get-assets-path';
import styles from './next-piece.module.css';

interface NextPieceProps {
  onPieceSuccessfullyPlaced?: (piece: VegetablePiece) => void;
}

// Компонент для отдельной перетаскиваемой фигуры
function DraggablePiece({ piece }: { piece: VegetablePiece }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: piece.id,
    data: piece,
  });

  return (
    <div 
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${styles.piece} ${styles.draggable} ${isDragging ? styles.dragging : ''}`}
    >
      {piece.shape.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.shapeRow}>
          {row.map((cell, colIndex) => (
            <div key={colIndex} className={styles.shapeCell}>
              {cell && (
                <div className={styles.cellWrapper}>
                  <div
                    className={styles.vegetableImage}
                    style={{
                      backgroundImage: `url(${getVegetableImagePath(piece.type)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              ) || ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function NextPiece({ onPieceSuccessfullyPlaced }: NextPieceProps) {
  const [pieces, setPieces] = useState<VegetablePiece[]>([]);

  // Генерируем фигуры только один раз при монтировании компонента
  useEffect(() => {
    generateNewPieces();
  }, []);

  // Генерируем новые фигуры
  const generateNewPieces = () => {
    const newPieces = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * vegetableShapes.length);
      newPieces.push({
        ...vegetableShapes[randomIndex],
        id: `${vegetableShapes[randomIndex].type}-${Date.now()}-${i}`
      });
    }
    setPieces(newPieces);
  };

  // Удаляем использованную фигуру
  const removeUsedPiece = (usedPieceId: string) => {
    setPieces(prevPieces => {
      const newPieces = prevPieces.filter(p => p.id !== usedPieceId);
      
      // Если все фигуры использованы, генерируем новые
      if (newPieces.length === 0) {
        setTimeout(() => {
          generateNewPieces();
        }, 100);
      }
      
      return newPieces;
    });
  };

  // Слушаем события успешного размещения фигур
  useEffect(() => {
    const handlePiecePlaced = (event: CustomEvent) => {
      const piece = event.detail as VegetablePiece;
      removeUsedPiece(piece.id);
      
      if (onPieceSuccessfullyPlaced) {
        onPieceSuccessfullyPlaced(piece);
      }
    };

    document.addEventListener('piecePlaced', handlePiecePlaced as EventListener);
    
    return () => {
      document.removeEventListener('piecePlaced', handlePiecePlaced as EventListener);
    };
  }, [onPieceSuccessfullyPlaced]);

  return (
    <div className={styles.nextPieceContainer}>
      <div className={styles.piecePreview}>
        <div className={styles.piecesRow}>
          {pieces.map((piece) => (
            <DraggablePiece
              key={piece.id}
              piece={piece}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 