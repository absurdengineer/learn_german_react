import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Writing: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Writing Practice
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Improve your German writing skills
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Writing practice content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Writing;
