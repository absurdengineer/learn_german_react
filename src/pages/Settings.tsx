import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your learning experience
        </Typography>
      </Box>
      
      <Typography variant="body1">
        Settings content will be implemented here...
      </Typography>
    </Container>
  );
};

export default Settings;
