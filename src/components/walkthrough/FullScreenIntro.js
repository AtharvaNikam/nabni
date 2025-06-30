// src/components/walkthrough/FullScreenIntro.js
import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useLocales } from 'src/locales';

const FullScreenIntro = ({ onStart }) => {
  const { t } = useLocales();

  console.log(onStart);
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 13001,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          px: 6,
          py: 4,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {t('walkthrough.welcomeTitle')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {t('walkthrough.welcomeMessage')}
        </Typography>
        <Button
          variant="contained"
          onClick={onStart}
          size="large"
          sx={{
            backgroundColor: '#28a745',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          {t('walkthrough.startButton')}
        </Button>
      </Paper>
    </Box>
  );
};

FullScreenIntro.propTypes = {
  onStart: PropTypes.func.isRequired,
};

export default FullScreenIntro;
