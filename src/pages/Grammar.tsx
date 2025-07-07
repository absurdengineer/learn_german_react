import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Grammar: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Grammar Lessons
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Master German grammar with interactive lessons
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Grammar lessons content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Grammar;
