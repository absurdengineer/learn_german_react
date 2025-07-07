import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Speaking: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Speaking Practice
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice German pronunciation and conversation
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Speaking practice content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Speaking;
