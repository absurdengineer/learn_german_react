
// Type definitions for Grammar domain
export type GrammarId = string;
export type LessonId = string;
export type GrammarCategory = 'articles' | 'verbs' | 'adjectives' | 'pronouns' | 'prepositions' | 'sentence-structure';

export interface GrammarRule {
  id: GrammarId;
  category: GrammarCategory;
  title: string;
  description: string;
  examples: string[];
  difficulty: number;
}

export interface GrammarProgress {
  userId: string;
  completedLessons: LessonId[];
  currentWeek: number;
  overallProgress: number;
}

interface GrammarLessonProps {
  day: number;
  title: string;
  content: string;
  mission: string;
  helpfulHint: string;
  funFact: string;
}

export class GrammarLesson {
  public readonly day: number;
  public readonly title: string;
  public readonly content: string;
  public readonly mission: string;
  public readonly helpfulHint: string;
  public readonly funFact: string;

  private constructor(props: GrammarLessonProps) {
    this.day = props.day;
    this.title = props.title;
    this.content = props.content;
    this.mission = props.mission;
    this.helpfulHint = props.helpfulHint;
    this.funFact = props.funFact;
  }

  public static create(props: GrammarLessonProps): GrammarLesson {
    return new GrammarLesson(props);
  }

  get week(): number {
    return Math.ceil(this.day / 7);
  }
}
