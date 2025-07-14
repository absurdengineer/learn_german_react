export type QuestionType = "vocab" | "article" | "grammar" | "speaking";
export type QuestionMode =
  | "flashcard"
  | "mc"
  | "translate"
  | "fill-blank"
  | "listening";

export interface Question {
  id: string;
  type: QuestionType;
  mode: QuestionMode | string;
  prompt: string;
  answer: string;
  options?: string[];
  helperText?: string;
  color?: string;
  data?: any;
}
