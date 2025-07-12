import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRandomVocabularyWords,
  getVocabularyWordsByCategory,
  loadVocabulary,
  loadVocabularyCategories,
  searchVocabularyWords
} from '../data';
import { type LevelType } from '../types/User';
import { VocabularyWord, type Gender, type WordType } from '../types/Vocabulary';
import { shuffleArray } from '../lib/testGenerator';
import { vocabularyToFlashcardAdapter } from '../components/FlashcardAdapters';
import type { QuizResults, QuizMistake } from '../components/QuizSession';
import type { FlashcardItem, FlashcardSessionResult } from '../components/FlashcardSession';

export interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: VocabularyWord[];
  mistakes: Array<{
    word: VocabularyWord;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export const useVocabulary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Record<string, { name: string; description: string; color?: string }>>({});
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionMode, setSessionMode] = useState<'browse' | 'session' | 'results'>('browse');
  const [sessionType, setSessionType] = useState<
    'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de'
  >('flashcards');
  const [sessionWords, setSessionWords] = useState<VocabularyWord[]>([]);
  const [sessionLength, setSessionLength] = useState(10);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [flashcardItems, setFlashcardItems] = useState<FlashcardItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    data: VocabularyWord;
  }>>([]);

  const navigate = useNavigate();

  const getSessionTitle = (type: string): string => {
    switch (type) {
      case 'translation-de-en':
        return 'German → English Translation';
      case 'translation-en-de':
        return 'English → German Translation';
      case 'multiple-choice-de-en':
        return 'Multiple Choice: German Words';
      case 'multiple-choice-en-de':
        return 'Multiple Choice: English Words';
      default:
        return 'Vocabulary Practice';
    }
  };

  const generateSessionQuestions = useCallback((
    type: 'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de',
    words: VocabularyWord[]
  ) => {
    if (type === 'flashcards') {
      const generatedFlashcards = vocabularyToFlashcardAdapter(words);
      setFlashcardItems(generatedFlashcards);
      setQuizQuestions([]);
    } else {
      const questions = words.map((word, index) => {
        let prompt: string;
        let correctAnswer: string;
        let wrongOptions: string[];

        switch (type) {
          case 'translation-de-en':
          case 'multiple-choice-de-en':
            prompt = `What is the English translation of "${word.german}"?`;
            correctAnswer = word.english;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.english)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
            break;
          case 'translation-en-de':
          case 'multiple-choice-en-de':
            prompt = `What is the German translation of "${word.english}"?`;
            correctAnswer = word.german;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.german)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
            break;
          default:
            prompt = `What is the English translation of "${word.german}"?`;
            correctAnswer = word.english;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.english)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
        }

        const options = type.includes('multiple-choice') 
          ? shuffleArray([correctAnswer, ...wrongOptions]).slice(0, 4)
          : [];

        return {
          id: `v-q${index + 1}`,
          prompt,
          options,
          correctAnswer,
          data: word,
        };
      });

      setQuizQuestions(questions);
      setFlashcardItems([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingError(null);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const vocabulary = loadVocabulary();
        const categories = loadVocabularyCategories();
        
        const convertedWords = vocabulary.map(item => 
          VocabularyWord.create({
            german: item.german,
            english: item.english,
            pronunciation: item.pronunciation,
            type: item.type as WordType,
            level: item.level as LevelType,
            gender: item.gender as Gender | undefined,
            tags: item.tags,
            frequency: item.frequency
          })
        );
        
        setAllWords(convertedWords);
        setFilteredWords(convertedWords);
        setAvailableCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vocabulary data:', error);
        setLoadingError('Failed to load vocabulary data. Please refresh the page.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (!allWords.length) return;
    
    let words: VocabularyWord[] = [];
    
    if (searchTerm.trim()) {
      words = searchVocabularyWords(searchTerm);
    } else if (selectedCategory === 'all') {
      words = allWords;
    } else {
      words = getVocabularyWordsByCategory(selectedCategory);
    }
    
    setFilteredWords(words);
  }, [searchTerm, selectedCategory, allWords]);

  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWord(null);
  };

  const startPractice = (
    type: 'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de',
    words: VocabularyWord[]
  ) => {
    setSessionType(type);
    setSessionWords(words);
    setSessionLength(words.length);
    generateSessionQuestions(type, words);
    setSessionMode('session');
  };

  const handleSessionComplete = (results: SessionResult) => {
    setSessionResults(results);
    setSessionMode('results');
  };

  const handleQuizComplete = (results: QuizResults) => {
    const sessionResult: SessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      wordsStudied: sessionWords,
      mistakes: results.mistakes.map((mistake: QuizMistake) => ({
        word: mistake.word || sessionWords.find(w => w.german === mistake.correctAnswer || w.english === mistake.correctAnswer) || sessionWords[0],
        userAnswer: mistake.userAnswer,
        correctAnswer: mistake.correctAnswer,
      })),
    };
    
    handleSessionComplete(sessionResult);
  };

  const handleFlashcardSessionComplete = (results: FlashcardSessionResult) => {
    const sessionResult: SessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      wordsStudied: sessionWords,
      mistakes: results.mistakes.map(mistake => ({
        word: sessionWords.find(w => w.id.value === mistake.item.id) || sessionWords[0],
        userAnswer: mistake.userAction || '',
        correctAnswer: mistake.item.back,
      })),
    };
    handleSessionComplete(sessionResult);
  };

  const handleSessionExit = () => {
    setSessionMode('browse');
    setSessionResults(null);
    setFlashcardItems([]);
    setQuizQuestions([]);
  };

  const handleRestart = () => {
    const newWords = getRandomVocabularyWords(sessionLength);
    setSessionWords(newWords);
    generateSessionQuestions(sessionType, newWords);
    setSessionMode('session');
  };

  const handleReviewMistakes = () => {
    if (sessionResults && sessionResults.mistakes.length > 0) {
      const mistakeWords = sessionResults.mistakes.map((m) => m.word);
      const shuffledWords = shuffleArray([...mistakeWords]);
      setSessionWords(shuffledWords);
      generateSessionQuestions(sessionType, shuffledWords);
      setSessionMode('session');
    }
  };

  const handleRandomWords = () => {
    setFilteredWords(getRandomVocabularyWords(20));
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allWords,
    filteredWords,
    availableCategories,
    selectedWord,
    dialogOpen,
    sessionMode,
    sessionType,
    sessionWords,
    sessionLength,
    sessionResults,
    loading,
    loadingError,
    flashcardItems,
    quizQuestions,
    handleWordClick,
    handleCloseDialog,
    startPractice,
    handleSessionComplete,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
    handleRandomWords,
    getSessionTitle,
    navigate,
  };
};
