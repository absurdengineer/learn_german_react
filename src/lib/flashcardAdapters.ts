import type { GrammarPracticeQuestion } from "../types/GrammarPractice";
import type { VocabularyWord } from "../types/Vocabulary";
import type { FlashcardItem } from "../types/Flashcard";
import { VocabularyQuestionType } from "../types/Flashcard";
import { getGenderColor, getGenderDisplayName } from "./genderColors";

/**
 * Converts Grammar Practice Questions to Flashcard Items
 */
export const grammarToFlashcardAdapter = (
  questions: GrammarPracticeQuestion[]
): FlashcardItem[] => {
  return questions.map((question) => ({
    id: question.id?.toString() || Math.random().toString(36).substr(2, 9),
    front: question.prompt,
    back: question.correctAnswer,
    category: question.category,
    helperText: question.helperText,
    metadata: {
      type: "grammar",
      originalQuestion: question,
    },
  }));
};

/**
 * Generates varied question types for vocabulary learning
 * Note: Only generates questions based on data available in vocabulary.csv
 */
export const generateVocabularyQuestion = (
  word: VocabularyWord,
  type?: VocabularyQuestionType
): Partial<FlashcardItem> => {
  const questionType = type || getRandomQuestionType(word);

  switch (questionType) {
    case VocabularyQuestionType.GERMAN_TO_ENGLISH:
      return {
        front: word.german,
        back: word.english,
        category: `🇩🇪→🇺🇸 ${word.type}`,
        helperText: word.pronunciation ? `/${word.pronunciation}/` : undefined,
      };

    case VocabularyQuestionType.ENGLISH_TO_GERMAN:
      return {
        front: word.english,
        back: word.german,
        category: `🇺🇸→🇩🇪 ${word.type}`,
        helperText: "What is the German word?",
      };

    case VocabularyQuestionType.GENDER_PRACTICE:
    case VocabularyQuestionType.ARTICLE_PRACTICE:
      // Disabled: vocabulary.csv contains no nouns with gender information
      // Fallback to German-to-English translation
      return generateVocabularyQuestion(
        word,
        VocabularyQuestionType.GERMAN_TO_ENGLISH
      );

    case VocabularyQuestionType.PRONUNCIATION:
      if (word.pronunciation) {
        return {
          front: `How do you pronounce "${word.german}"?`,
          back: `/${word.pronunciation}/`,
          category: "🗣️ Pronunciation",
          helperText: `${word.english} (${word.type})`,
        };
      }
      return generateVocabularyQuestion(
        word,
        VocabularyQuestionType.GERMAN_TO_ENGLISH
      );

    case VocabularyQuestionType.CONTEXT_CLUE:
      if (word.exampleSentences.length > 0) {
        const example = word.exampleSentences[0];
        const hiddenWord = word.german;

        // Try multiple replacement strategies to ensure we find the word
        let sentenceWithBlank = example.german;

        // Strategy 1: Exact case-insensitive match with word boundaries
        const wordBoundaryRegex = new RegExp(
          `\\b${hiddenWord.replace(/[.*+?^${}()|[\\]/g, "\\$&")}\\b`,
          "gi"
        );
        sentenceWithBlank = sentenceWithBlank.replace(
          wordBoundaryRegex,
          "____"
        );

        // Strategy 2: If no replacement happened, try without word boundaries (for partial matches)
        if (sentenceWithBlank === example.german) {
          const simpleRegex = new RegExp(
            hiddenWord.replace(/[.*+?^${}()|[\\]/g, "\\$&"),
            "gi"
          );
          sentenceWithBlank = sentenceWithBlank.replace(simpleRegex, "____");
        }

        // Strategy 3: If still no replacement, check for capitalized version at start of sentence
        if (sentenceWithBlank === example.german) {
          const capitalizedWord =
            hiddenWord.charAt(0).toUpperCase() + hiddenWord.slice(1);
          const capitalizedRegex = new RegExp(
            `\\b${capitalizedWord.replace(/[.*+?^${}()|[\\]/g, "\\$&")}\\b`,
            "g"
          );
          sentenceWithBlank = sentenceWithBlank.replace(
            capitalizedRegex,
            "____"
          );
        }

        // Only create context question if we successfully created a blank
        if (
          sentenceWithBlank !== example.german &&
          sentenceWithBlank.includes("____")
        ) {
          return {
            front: `Fill in the blank:\n"${sentenceWithBlank}"`,
            back: hiddenWord,
            category: "📖 Context Practice",
            helperText: `Translation: "${example.english}"`,
          };
        }
      }
      return generateVocabularyQuestion(
        word,
        VocabularyQuestionType.GERMAN_TO_ENGLISH
      );

    case VocabularyQuestionType.WORD_BUILDING:
      if (word.type === "verb") {
        return {
          front: `What is the infinitive form?\n"${word.english}"`,
          back: word.german,
          category: "🔧 Word Building",
          helperText: "Think about the verb form",
        };
      }
      return generateVocabularyQuestion(
        word,
        VocabularyQuestionType.ENGLISH_TO_GERMAN
      );

    default:
      return generateVocabularyQuestion(
        word,
        VocabularyQuestionType.GERMAN_TO_ENGLISH
      );
  }
};

/**
 * Randomly selects a question type based on word properties
 */
export const getRandomQuestionType = (
  word: VocabularyWord
): VocabularyQuestionType => {
  const availableTypes: VocabularyQuestionType[] = [
    VocabularyQuestionType.GERMAN_TO_ENGLISH,
    VocabularyQuestionType.ENGLISH_TO_GERMAN,
  ];

  // Add pronunciation if available
  if (word.pronunciation) {
    availableTypes.push(VocabularyQuestionType.PRONUNCIATION);
  }

  // Add context clue if example sentences available
  if (word.exampleSentences.length > 0) {
    availableTypes.push(VocabularyQuestionType.CONTEXT_CLUE);
  }

  // Add word building for verbs
  if (word.type === "verb") {
    availableTypes.push(VocabularyQuestionType.WORD_BUILDING);
  }

  // Randomly select from available types
  const randomIndex = Math.floor(Math.random() * availableTypes.length);
  return availableTypes[randomIndex];
};

/**
 * Converts vocabulary words to flashcard items
 */
export const vocabularyToFlashcardAdapter = (
  words: VocabularyWord[]
): FlashcardItem[] => {
  return words.map((word) => {
    const questionData = generateVocabularyQuestion(word);
    return {
      id: word.id?.toString() || Math.random().toString(36).substr(2, 9),
      front: questionData.front || word.german,
      back: questionData.back || word.english,
      category: questionData.category || `🇩🇪 ${word.type}`,
      helperText: questionData.helperText,
      metadata: {
        type: "vocabulary",
        originalWord: word,
      },
    };
  });
};

/**
 * Converts vocabulary words to flashcard items with preferred question types
 */
export const vocabularyToFlashcardAdapterWithType = (
  words: VocabularyWord[],
  preferredTypes?: VocabularyQuestionType[],
  forceVariety: boolean = true
): FlashcardItem[] => {
  if (!preferredTypes || preferredTypes.length === 0) {
    return vocabularyToFlashcardAdapter(words);
  }

  const usedTypes = new Set<VocabularyQuestionType>();

  return words.map((word, index) => {
    let selectedType: VocabularyQuestionType;

    if (forceVariety && usedTypes.size < preferredTypes.length) {
      // Use a type we haven't used yet
      const unusedTypes = preferredTypes.filter((type) => !usedTypes.has(type));
      selectedType =
        unusedTypes[Math.floor(Math.random() * unusedTypes.length)];
      usedTypes.add(selectedType);
    } else {
      // Randomly select from preferred types
      selectedType =
        preferredTypes[Math.floor(Math.random() * preferredTypes.length)];
    }

    const questionData = generateVocabularyQuestion(word, selectedType);

    return {
      id: word.id?.toString() || Math.random().toString(36).substr(2, 9),
      front: questionData.front || word.german,
      back: questionData.back || word.english,
      category: questionData.category || `🇩🇪 ${word.type}`,
      helperText: questionData.helperText,
      metadata: {
        type: "vocabulary",
        originalWord: word,
        questionType: selectedType,
      },
    };
  });
};

/**
 * Gets description for vocabulary question types
 */
export const getQuestionTypeDescription = (
  type: VocabularyQuestionType
): { name: string; emoji: string; description: string } => {
  switch (type) {
    case VocabularyQuestionType.GERMAN_TO_ENGLISH:
      return {
        name: "German to English",
        emoji: "🇩🇪→🇺🇸",
        description: "Translate German words to English",
      };
    case VocabularyQuestionType.ENGLISH_TO_GERMAN:
      return {
        name: "English to German",
        emoji: "🇺🇸→🇩🇪",
        description: "Translate English words to German",
      };
    case VocabularyQuestionType.GENDER_PRACTICE:
      return {
        name: "Gender Practice",
        emoji: "🎭",
        description: "Practice noun genders (der/die/das)",
      };
    case VocabularyQuestionType.ARTICLE_PRACTICE:
      return {
        name: "Article Practice",
        emoji: "📝",
        description: "Practice with articles and cases",
      };
    case VocabularyQuestionType.PRONUNCIATION:
      return {
        name: "Pronunciation",
        emoji: "🗣️",
        description: "Practice word pronunciation",
      };
    case VocabularyQuestionType.CONTEXT_CLUE:
      return {
        name: "Context Clues",
        emoji: "📖",
        description: "Learn words in context",
      };
    case VocabularyQuestionType.WORD_BUILDING:
      return {
        name: "Word Building",
        emoji: "🔧",
        description: "Practice word forms and conjugations",
      };
    default:
      return {
        name: "Translation",
        emoji: "🔄",
        description: "Basic translation practice",
      };
  }
};
