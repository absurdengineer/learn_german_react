import { useState, useMemo, useRef } from "react";
import { getVocabularyQuestions } from "../core/question-engine";

// Utility: Map any question to uniform { id, prompt, answer, options?, category? }
function mapToUniformQuestion(q: any): any {
  return {
    id: q.id,
    prompt: q.prompt || q.question || q.word?.prompt || "No prompt available",
    answer:
      q.answer ||
      q.correctAnswer ||
      q.word?.answer ||
      q.word?.correctAnswer ||
      "",
    options: q.options || q.word?.options || [],
    category:
      q.category || q.word?.category || q.type || q.word?.type || undefined,
    // Pass through mode and any other metadata if present
    mode: q.mode || q.word?.mode,
    ...q,
  };
}

export function useVocabularySession() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sessionMode, setSessionMode] = useState<
    "idle" | "session" | "results"
  >("idle");
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [sessionResults, setSessionResults] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  // Load all questions (simulate, or replace with real data loader)
  const allQuestions = useMemo(
    () => getVocabularyQuestions({ mode: "all", count: 1000 }),
    []
  );

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    let filtered = allQuestions;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((q: any) => q.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (q: any) =>
          q.prompt.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [allQuestions, selectedCategory, searchTerm]);

  // Store last session mode and config for 'Try Again'
  const lastSessionConfig = useRef<{
    mode: string;
    count: number;
    category?: string;
  } | null>(null);

  // Handlers
  const handleQuestionClick = (question: any) => {
    setSelectedQuestion(question);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuestion(null);
  };

  // Session logic
  const startPractice = (
    mode: string,
    questions: any[],
    config?: { count: number; category?: string }
  ) => {
    lastSessionConfig.current = {
      mode,
      count: config?.count || questions.length,
      category: config?.category,
    };
    setSessionQuestions(
      questions.map((q) => ({ ...mapToUniformQuestion(q), mode }))
    );
    setSessionMode("session");
  };
  const handleSessionExit = () => {
    setSessionMode("idle");
    setSessionQuestions([]);
    setSessionResults(null);
  };
  const handleSessionComplete = (results: any) => {
    setSessionResults(results);
    setSessionMode("results");
  };
  const handleRestart = () => {
    if (lastSessionConfig.current) {
      const { mode, count, category } = lastSessionConfig.current;
      // Use getVocabularyQuestions to get new questions for the same mode/config
      let newQuestions = getVocabularyQuestions({ mode, count, category });
      setSessionQuestions(
        newQuestions.map((q) => ({ ...mapToUniformQuestion(q), mode }))
      );
      setSessionMode("session");
      setSessionResults(null);
    } else {
      setSessionMode("idle");
      setSessionQuestions([]);
      setSessionResults(null);
    }
  };
  const handleReviewMistakes = (mode: string) => {
    if (sessionResults && sessionResults.mistakes) {
      // Map mistakes to the correct shape for the mode
      let questions: any[] = [];
      if (mode === "translation-de-en" || mode === "translation-en-de") {
        questions = sessionResults.mistakes.map((m: any) => ({
          prompt: m.prompt,
          answer: m.correctAnswer,
          helperText: m.helperText || m.hint,
          category: m.category,
          mode,
        }));
      } else if (
        mode === "multiple-choice-de-en" ||
        mode === "multiple-choice-en-de"
      ) {
        questions = sessionResults.mistakes.map((m: any) => ({
          prompt: m.prompt,
          answer: m.correctAnswer,
          helperText: m.helperText || m.hint,
          category: m.category,
          options: m.options,
          mode,
        }));
      } else if (mode === "flashcard") {
        questions = sessionResults.mistakes.map((m: any) => ({
          prompt: m.prompt,
          answer: m.correctAnswer,
          helperText: m.helperText || m.hint,
          category: m.category,
          mode,
        }));
      } else {
        // fallback: just map
        questions = sessionResults.mistakes.map((m: any) => ({
          prompt: m.prompt,
          answer: m.correctAnswer,
          helperText: m.helperText || m.hint,
          category: m.category,
          mode,
        }));
      }
      setSessionQuestions(questions);
      setSessionMode("session");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allQuestions,
    filteredQuestions,
    sessionMode,
    sessionQuestions,
    sessionResults,
    dialogOpen,
    selectedQuestion,
    handleQuestionClick,
    handleCloseDialog,
    startPractice,
    handleSessionExit,
    handleSessionComplete,
    handleRestart,
    handleReviewMistakes,
  };
}
