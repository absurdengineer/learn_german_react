export interface NewLesson {
  id: string;
  type: "new_lesson";
  day: number;
  week: number;
  theme: string;
  title: string;
  introduction: string;
  mainContent: string;
  vocabularyFocus: string;
  nounFocus: string;
  grammarFocus: string;
  grammarDataFocus: string;
  reviewContent: string;
  estimatedTime: number;
  difficultyLevel: number;
  successCriteria: string;
  hints: string;
  funFacts: string;
  culturalHighlight: string;
  motivationalNote: string;
}
