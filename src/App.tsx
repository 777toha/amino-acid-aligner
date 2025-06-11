import React from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';
import AminoAcidAligner from './AminoAcidAligner';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center" mb="50px">
          Визуализатор выравнивания аминокислотных последовательностей
        </Typography>
        <AminoAcidAligner />
      </Container>
    </>
  );
};

export default App;