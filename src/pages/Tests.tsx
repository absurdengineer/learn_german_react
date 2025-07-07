import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Tests: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Practice Tests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Test your German knowledge with practice exams
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Test content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Tests;
