import { useDroppable } from '@dnd-kit/core';
import { type VegetablePiece } from './game-provider';
import { getVegetableImagePath } from '$/utils/get-assets-path';
import styles from './game-board.module.css';

interface GameBoardProps {
  board: (VegetablePiece | null)[][];
  onPieceDrop?: (piece: VegetablePiece, row: number, col: number) => boolean;
  isGameOver: boolean;
  previewPosition?: { row: number; col: number } | null;
  previewPiece?: VegetablePiece | null;
  isValidPosition?: boolean;
}

// Компонент для отдельной ячейки игрового поля
function GameCell({ 
  cell, 
  rowIndex, 
  colIndex, 
  isPreview,
  isValidPosition,
  isGameOver 
}: {
  cell: VegetablePiece | null;
  rowIndex: number;
  colIndex: number;
  isPreview?: boolean;
  isValidPosition?: boolean;
  previewColor?: string;
  isGameOver: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${rowIndex}-${colIndex}`,
    disabled: isGameOver || cell !== null,
  });

  const getCellClassName = () => {
    const baseClass = styles.cell;
    const filledClass = cell ? styles.filled : '';
    const dragOverClass = isOver && !cell ? styles.dragOver : ''; // Не показываем dragOver для заполненных ячеек
    const previewClass = isPreview ? styles.preview : '';
    const validPreviewClass = isPreview && isValidPosition ? styles.validPreview : '';
    const invalidPreviewClass = isPreview && !isValidPosition ? styles.invalidPreview : '';
    
    return [baseClass, filledClass, dragOverClass, previewClass, validPreviewClass, invalidPreviewClass]
      .filter(Boolean)
      .join(' ');
  };

  const getCellStyle = () => {
    if (cell) {
      return {
        backgroundImage: `url(${getVegetableImagePath(cell.type)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    if (isPreview) {
      if (isValidPosition) {
        return {
          backgroundColor: 'rgba(76, 175, 80, 0.3)', // Зеленый для валидной позиции
          border: '2px dashed #4CAF50',
          opacity: 0.8
        };
      } else {
        return {
          backgroundColor: 'rgba(244, 67, 54, 0.3)', // Красный для невалидной позиции
          border: '2px dashed #F44336',
          opacity: 0.6
        };
      }
    }
    
    return {
      backgroundColor: 'transparent',
      border: 'none'
    };
  };

  return (
    <div
      ref={setNodeRef}
      className={getCellClassName()}
      style={getCellStyle()}
    >
      {cell && <div className={styles.vegetableIcon} />}
    </div>
  );
}

export function GameBoard({ 
  board, 
  isGameOver, 
  previewPosition,
  previewPiece,
  isValidPosition = true
}: GameBoardProps) {
  // Функция для определения, является ли ячейка частью предварительного просмотра
  const isPreviewCell = (rowIndex: number, colIndex: number): boolean => {
    if (!previewPosition || !previewPiece) return false;
    
    const { row: previewRow, col: previewCol } = previewPosition;
    const relativeRow = rowIndex - previewRow;
    const relativeCol = colIndex - previewCol;
    
    return (
      relativeRow >= 0 && 
      relativeRow < previewPiece.shape.length &&
      relativeCol >= 0 && 
      relativeCol < previewPiece.shape[0].length &&
      previewPiece.shape[relativeRow][relativeCol] === 1
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => {
              const isPreview = isPreviewCell(rowIndex, colIndex);
              
              return (
                <GameCell
                  key={`${rowIndex}-${colIndex}`}
                  cell={cell}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  isPreview={isPreview}
                  isValidPosition={isValidPosition}
                  previewColor={previewPiece?.color}
                  isGameOver={isGameOver}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
} 