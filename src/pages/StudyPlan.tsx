import {
    Book,
    CheckCircle,
    Create,
    Headphones,
    MenuBook,
    PlayArrow,
    Quiz,
    RadioButtonUnchecked,
    RecordVoiceOver,
    Schedule,
    TrendingUp,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { Exercise, StudyDay } from '../data/studyPlan';
import { STUDY_PLAN, calculateProgress, getStudyDayById } from '../data/studyPlan';
import { useProgress } from '../hooks/useApp';

const StudyPlan: React.FC = () => {
  const progress = useProgress();
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const progressStats = calculateProgress(progress.completedDays);

  const handleDayClick = (day: StudyDay) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDay(null);
  };

  const isDayCompleted = (dayNumber: number) => {
    return progress.completedDays.includes(dayNumber);
  };

  const isDayAvailable = (dayNumber: number) => {
    return dayNumber <= progress.currentDay;
  };

  const getExerciseIcon = (type: Exercise['type']) => {
    switch (type) {
      case 'vocabulary': return <Book />;
      case 'grammar': return <MenuBook />;
      case 'listening': return <Headphones />;
      case 'speaking': return <RecordVoiceOver />;
      case 'writing': return <Create />;
      case 'reading': return <MenuBook />;
      default: return <Quiz />;
    }
  };

  const getDifficultyColor = (difficulty: StudyDay['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          30-Day Study Plan
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your personalized German A1 learning journey
        </Typography>
      </Box>

      {/* Progress Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp />
          Overall Progress
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {progressStats.percentage}% Complete • Week {progressStats.currentWeek} of 5
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressStats.percentage}
            sx={{ height: 8, borderRadius: 1, mt: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`${progress.completedDays.length} days completed`}
            color="success"
            size="small"
          />
          <Chip
            label={`${progressStats.remainingDays} days remaining`}
            color="info"
            size="small"
          />
          <Chip
            label={`${progressStats.completedWeeks} weeks completed`}
            color="primary"
            size="small"
          />
        </Box>
      </Paper>

      {/* Current Day Alert */}
      {progress.currentDay <= 30 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Today:</strong> Day {progress.currentDay} - {getStudyDayById(progress.currentDay)?.title}
          </Typography>
        </Alert>
      )}

      {/* Study Days Grid */}
      <Typography variant="h6" gutterBottom>
        Study Days
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {STUDY_PLAN.map((day) => {
          const isCompleted = isDayCompleted(day.day);
          const isAvailable = isDayAvailable(day.day);
          const isCurrent = day.day === progress.currentDay;

          return (
            <Card
              key={day.day}
              sx={{
                opacity: isAvailable ? 1 : 0.6,
                border: isCurrent ? '2px solid' : '1px solid',
                borderColor: isCurrent ? 'primary.main' : 'divider',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: isAvailable ? 'translateY(-2px)' : 'none',
                  boxShadow: isAvailable ? 2 : 1,
                },
              }}
              onClick={() => isAvailable && handleDayClick(day)}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="h2">
                    Day {day.day}
                  </Typography>
                  {isCompleted ? (
                    <CheckCircle color="success" />
                  ) : (
                    <RadioButtonUnchecked color={isAvailable ? 'primary' : 'disabled'} />
                  )}
                </Box>
                <Typography variant="body1" gutterBottom>
                  {day.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {day.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    label={day.difficulty}
                    color={getDifficultyColor(day.difficulty)}
                    size="small"
                  />
                  <Chip
                    label={`${day.estimatedTime} min`}
                    icon={<Schedule />}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  disabled={!isAvailable}
                  startIcon={isCompleted ? <CheckCircle /> : <PlayArrow />}
                  color={isCompleted ? 'success' : 'primary'}
                  variant={isCurrent ? 'contained' : 'outlined'}
                >
                  {isCompleted ? 'Completed' : isCurrent ? 'Start Today' : 'View'}
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>

      {/* Day Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' }
        }}
      >
        {selectedDay && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h5" component="h2">
                Day {selectedDay.day}: {selectedDay.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDay.description}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Focus Areas
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedDay.focusAreas.map((area, index) => (
                    <Chip key={index} label={area.replace('_', ' ')} size="small" />
                  ))}
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                Exercises ({selectedDay.exercises.length})
              </Typography>
              <List>
                {selectedDay.exercises.map((exercise) => (
                  <React.Fragment key={exercise.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getExerciseIcon(exercise.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={exercise.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {exercise.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip
                                label={exercise.type}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${exercise.estimatedTime} min`}
                                size="small"
                                variant="outlined"
                              />
                              {exercise.isRequired && (
                                <Chip
                                  label="Required"
                                  color="error"
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                onClick={handleCloseDialog}
                disabled={!isDayAvailable(selectedDay.day)}
              >
                {isDayCompleted(selectedDay.day) ? 'Review' : 'Start Exercises'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default StudyPlan;
