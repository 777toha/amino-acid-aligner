import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import SequenceVisualizer from './SequenceVisualizer';

const AminoAcidAligner: React.FC = () => {
  const [sequences, setSequences] = useState<{ seq1: string; seq2: string } | null>(null);

  const validationSchema = Yup.object({
    sequence1: Yup.string()
      .required('Обязательное поле')
      .matches(/^[ARNDCQEGHILKMFPSTWYV-]+$/i, 'Только буквы аминокислот (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) или -'),
    sequence2: Yup.string()
      .required('Обязательное поле')
      .matches(/^[ARNDCQEGHILKMFPSTWYV-]+$/i, 'Только буквы аминокислот (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) или -')
      .test('length-match', 'Sequences must be of equal length', function (value) {
        return value.length === this.parent.sequence1.length;
      }),
  });

  const formik = useFormik({
    initialValues: {
      sequence1: '',
      sequence2: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setSequences({
        seq1: values.sequence1.toUpperCase(),
        seq2: values.sequence2.toUpperCase(),
      });
    },
  });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          mb={4}
        >
          <Box width={{ xs: '100%', sm: '50%' }}>
            <TextField
              fullWidth
              id="sequence1"
              name="sequence1"
              label="Первая последовательность"
              placeholder="Например: VLSPADKTNIKASWEKIGSHG"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sequence1}
              error={formik.touched.sequence1 && Boolean(formik.errors.sequence1)}
              helperText={formik.touched.sequence1 && formik.errors.sequence1}
            />
          </Box>
          <Box width={{ xs: '100%', sm: '50%' }}>
            <TextField
              fullWidth
              id="sequence2"
              name="sequence2"
              label="Вторая последовательность"
              placeholder="Например: VLSPADKTNIKASWEKIGSHG"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sequence2}
              error={formik.touched.sequence2 && Boolean(formik.errors.sequence2)}
              helperText={formik.touched.sequence2 && formik.errors.sequence2}
            />
          </Box>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Выровнять последовательности
        </Button>
      </form>

      {sequences && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Визуализацию выравнивания:
          </Typography>
          <SequenceVisualizer seq1={sequences.seq1} seq2={sequences.seq2} />
        </Box>
      )}
    </Box>
  );
};

export default AminoAcidAligner;