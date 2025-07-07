import {
    EmojiEvents,
    LocalFireDepartment,
    Today,
    TrendingUp,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    LinearProgress,
    Paper,
    Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress, useUser } from '../hooks/useApp';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  const progress = useProgress();

  const quickActions = [
    {
      title: 'Continue Study Plan',
      description: `Day ${progress.currentDay} of 30`,
      action: () => navigate('/study-plan'),
      color: 'primary' as const,
    },
    {
      title: 'Practice Vocabulary',
      description: `${progress.vocabularyLearned} words learned`,
      action: () => navigate('/vocabulary'),
      color: 'secondary' as const,
    },
    {
      title: 'Take a Test',
      description: 'Check your knowledge',
      action: () => navigate('/tests'),
      color: 'success' as const,
    },
    {
      title: 'View Progress',
      description: 'See your achievements',
      action: () => navigate('/progress'),
      color: 'info' as const,
    },
  ];

  const stats = [
    {
      label: 'Study Streak',
      value: `${progress.streakDays} days`,
      icon: LocalFireDepartment,
      color: 'error' as const,
    },
    {
      label: 'Total Study Time',
      value: `${Math.floor(progress.weeklyProgress.reduce((acc, week) => acc + week.studyHours, 0))} hours`,
      icon: Today,
      color: 'primary' as const,
    },
    {
      label: 'Words Mastered',
      value: progress.vocabularyMastered.toString(),
      icon: EmojiEvents,
      color: 'success' as const,
    },
    {
      label: 'Overall Progress',
      value: `${Math.round((progress.currentDay / 30) * 100)}%`,
      icon: TrendingUp,
      color: 'info' as const,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user.name}! 🇩🇪
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your German A1 learning journey
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Progress
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Day {progress.currentDay} of 30 ({Math.round((progress.currentDay / 30) * 100)}% complete)
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(progress.currentDay / 30) * 100}
            sx={{ height: 8, borderRadius: 1, mt: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {progress.streakDays > 0 && (
            <Chip
              icon={<LocalFireDepartment />}
              label={`${progress.streakDays} day streak`}
              color="error"
              size="small"
            />
          )}
          <Chip
            label={`${progress.vocabularyLearned} words learned`}
            color="primary"
            size="small"
          />
          <Chip
            label={`${progress.vocabularyMastered} words mastered`}
            color="success"
            size="small"
          />
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4
        }}
      >
        {quickActions.map((action, index) => (
          <Card sx={{ height: '100%' }} key={index}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color={action.color}
                onClick={action.action}
                variant="contained"
                fullWidth
              >
                Start
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Stats */}
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 3
        }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Icon color={stat.color} />
                <Box>
                  <Typography variant="h6">{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Home;
