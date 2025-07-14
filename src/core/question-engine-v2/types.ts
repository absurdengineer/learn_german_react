export type Resource = "vocabularies" | "nouns";
export type QuestionTypeV2 =
  | "flashcards"
  | "mcq-de"
  | "mcq-en"
  | "q&a"
  | "fill_blank"
  | "article";

export type QuestionModeV2 =
  | "flashcards"
  | "mcq-de"
  | "mcq-en"
  | "q&a"
  | "fill_blank"
  | "article";

export interface QuestionEngineV2Config {
  resource?: Resource;
  category?: string;
  mode?: QuestionModeV2;
  level?: number;
  difficulty?: number;
  q_no: number;
}

export interface QuestionV2 {
  id: string;
  type: QuestionTypeV2;
  mode: QuestionModeV2;
  prompt: string;
  answer: string;
  options?: string[];
  helperText?: string;
  color?: string;
  data?: any;
}
