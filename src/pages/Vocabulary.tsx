import {
    Check,
    Close,
    FlipCameraAndroid,
    Search,
    Shuffle,
    VolumeUp,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { VocabularyWord } from '../data/vocabulary';
import { ESSENTIAL_VOCABULARY, VOCABULARY_CATEGORIES, getRandomVocabulary, getVocabularyByCategory, searchVocabulary } from '../data/vocabulary';
import { useProgress } from '../hooks/useApp';

const Vocabulary: React.FC = () => {
  const progress = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>(ESSENTIAL_VOCABULARY);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentPracticeWord, setCurrentPracticeWord] = useState<VocabularyWord | null>(null);
  const [practiceWords, setPracticeWords] = useState<VocabularyWord[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [practiceStats, setPracticeStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    let words = ESSENTIAL_VOCABULARY;
    
    if (selectedCategory !== 'all') {
      words = getVocabularyByCategory(selectedCategory);
    }
    
    if (searchTerm) {
      words = searchVocabulary(searchTerm);
    }
    
    setFilteredWords(words);
  }, [searchTerm, selectedCategory]);

  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWord(null);
  };

  const startPractice = () => {
    const words = getRandomVocabulary(10);
    setPracticeWords(words);
    setPracticeIndex(0);
    setCurrentPracticeWord(words[0]);
    setPracticeMode(true);
    setShowTranslation(false);
    setPracticeStats({ correct: 0, total: 0 });
  };

  const nextPracticeWord = () => {
    if (practiceIndex < practiceWords.length - 1) {
      setPracticeIndex(practiceIndex + 1);
      setCurrentPracticeWord(practiceWords[practiceIndex + 1]);
      setShowTranslation(false);
    } else {
      // Practice complete
      setPracticeMode(false);
      setCurrentPracticeWord(null);
    }
  };

  const handlePracticeAnswer = (correct: boolean) => {
    setPracticeStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    setTimeout(() => {
      nextPracticeWord();
    }, 1000);
  };

  const getDifficultyColor = (difficulty: VocabularyWord['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  if (practiceMode && currentPracticeWord) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Vocabulary Practice
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {practiceIndex + 1} of {practiceWords.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(practiceIndex / practiceWords.length) * 100}
            sx={{ mb: 4 }}
          />
          
          <Card sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                {currentPracticeWord.german}
              </Typography>
              <IconButton onClick={() => speakWord(currentPracticeWord.german)}>
                <VolumeUp />
              </IconButton>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<FlipCameraAndroid />}
                  onClick={() => setShowTranslation(!showTranslation)}
                >
                  {showTranslation ? 'Hide' : 'Show'} Translation
                </Button>
              </Box>
              {showTranslation && (
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  {currentPracticeWord.english}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<Check />}
              onClick={() => handlePracticeAnswer(true)}
              disabled={!showTranslation}
            >
              I knew this
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Close />}
              onClick={() => handlePracticeAnswer(false)}
              disabled={!showTranslation}
            >
              I didn't know
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Score: {practiceStats.correct}/{practiceStats.total} 
              {practiceStats.total > 0 && (
                <> ({Math.round((practiceStats.correct / practiceStats.total) * 100)}%)</>
              )}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vocabulary Practice
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn and practice German vocabulary with flashcards
        </Typography>
      </Box>

      {/* Stats and Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
            <Chip
              label={`${ESSENTIAL_VOCABULARY.length} total words`}
              color="info"
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Shuffle />}
            onClick={startPractice}
            color="primary"
          >
            Practice Random Words
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search words"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {VOCABULARY_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Results */}
      <Typography variant="h6" gutterBottom>
        Vocabulary ({filteredWords.length} words)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {filteredWords.map((word) => (
          <Card
            key={word.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 2,
              },
            }}
            onClick={() => handleWordClick(word)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="h6" component="h2">
                  {word.german}
                </Typography>
                <IconButton size="small" onClick={(e) => {
                  e.stopPropagation();
                  speakWord(word.german);
                }}>
                  <VolumeUp fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {word.english}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={word.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={word.difficulty}
                  color={getDifficultyColor(word.difficulty)}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Word Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedWord && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5">{selectedWord.german}</Typography>
                <IconButton onClick={() => speakWord(selectedWord.german)}>
                  <VolumeUp />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h6" gutterBottom>
                {selectedWord.english}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  label={selectedWord.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={selectedWord.difficulty}
                  color={getDifficultyColor(selectedWord.difficulty)}
                  size="small"
                />
              </Box>
              {selectedWord.example && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Example:
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    {selectedWord.example}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button variant="contained" onClick={handleCloseDialog}>
                Mark as Learned
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Vocabulary;
