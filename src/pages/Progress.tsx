import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Progress: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Progress
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your German learning progress
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Progress tracking content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Progress;
