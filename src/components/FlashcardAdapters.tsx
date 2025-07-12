// This file has been refactored. All adapters and utilities have been moved to:
// - src/lib/flashcardAdapters.ts (for adapters and question generation)
// - src/lib/flashcardRenderers.tsx (for renderer components)
// - src/types/Flashcard.ts (for types and interfaces)

// Re-export the main adapters for backward compatibility
export {
  grammarToFlashcardAdapter,
  vocabularyToFlashcardAdapter,
  vocabularyToFlashcardAdapterWithType,
  generateVocabularyQuestion,
  getRandomQuestionType,
  getQuestionTypeDescription,
} from "../lib/flashcardAdapters";

export {
  VocabularyAdditionalInfo,
  vocabularyFlashcardRenderer,
  grammarFlashcardRenderer,
} from "../lib/flashcardRenderers";

export { VocabularyQuestionType } from "../types/Flashcard";
