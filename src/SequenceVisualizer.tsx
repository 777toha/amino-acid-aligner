import React, { useState, useEffect, useRef } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { AMINO_ACID_COLORS } from './constants';

interface SequenceVisualizerProps {
  seq1: string;
  seq2: string;
}

const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({ seq1, seq2 }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [copiedFrom, setCopiedFrom] = useState<'seq1' | 'seq2' | null>(null);
  const [chunkSize, setChunkSize] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateChunkSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const padding = 32;
        const charWidth = 17.84;
        const margin = 0.2 * 2 * 8;
        
        const availableWidth = containerWidth - padding;
        
        const totalCharWidth = charWidth + margin;
        
        const calculatedChunkSize = Math.floor(availableWidth / totalCharWidth);
        
        setChunkSize(Math.max(1, calculatedChunkSize));
      }
    };

    calculateChunkSize();
    window.addEventListener('resize', calculateChunkSize);
    
    return () => window.removeEventListener('resize', calculateChunkSize);
  }, []);

  const handleCopy = (text: string, source: 'seq1' | 'seq2') => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedFrom(source);
        setOpenSnackbar(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setCopiedFrom(null);
  };

  const handleTextSelection = (e: React.MouseEvent, isSeq1: boolean) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      handleCopy(selectedText, isSeq1 ? 'seq1' : 'seq2');
    }
  };

  const createChunks = (sequence: string) => {
    if (chunkSize <= 0) return [sequence];
    
    const chunks = [];
    for (let i = 0; i < sequence.length; i += chunkSize) {
      chunks.push(sequence.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const seq1Chunks = createChunks(seq1);
  const seq2Chunks = createChunks(seq2);

  const renderChunk = (chunk: string, isSeq1: boolean, referenceChunk?: string) => {
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0 16px',
        }}
        onMouseUp={(e) => handleTextSelection(e, isSeq1)}
      >
        {Array.from(chunk).map((char, index) => {
          const upperChar = char.toUpperCase();
          const isDifferent = !isSeq1 && referenceChunk && char !== referenceChunk[index];
          const bgColor = isSeq1
            ? AMINO_ACID_COLORS[upperChar] || '#f5f5f5'
            : isDifferent ? '#ffcdd2' : 'transparent';

          return (
            <Box
              key={index}
              component="span"
              sx={{
                width: '17.84px',
                display: 'inline-flex',
                justifyContent: 'center',
                p: 0.5,
                m: 0.2,
                bgcolor: bgColor,
                borderRadius: '4px',
                border: isDifferent ? '1px solid #f44336' : 'none',
                '&:hover': { opacity: 0.8 },
                flexShrink: 0,
              }}
            >
              {char}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        lineHeight: '1.5',
        userSelect: 'text',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Рендерим чанки попарно */}
      {seq1Chunks.map((chunk, index) => (
        <React.Fragment key={index}>
          {renderChunk(chunk, true)}
          {renderChunk(seq2Chunks[index] || '', false, chunk)}
        </React.Fragment>
      ))}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Скопировано из {copiedFrom === 'seq1' ? 'первой' : 'второй'} последовательности!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SequenceVisualizer;