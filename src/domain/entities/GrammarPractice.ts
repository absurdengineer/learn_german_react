import type { QuestionType } from '../types/GrammarPracticeTypes';

interface GrammarPracticeQuestionProps {
  id: number;
  dayReference: number;
  category: string;
  questionType: QuestionType;
  prompt: string;
  correctAnswer: string;
  optionB: string;
  optionC: string;
  helperText: string;
}

export class GrammarPracticeQuestion {
  public readonly id: number;
  public readonly dayReference: number;
  public readonly category: string;
  public readonly questionType: QuestionType;
  public readonly prompt: string;
  public readonly correctAnswer: string;
  public readonly options: string[];
  public readonly helperText: string;

  private constructor(props: GrammarPracticeQuestionProps, shuffledOptions: string[]) {
    this.id = props.id;
    this.dayReference = props.dayReference;
    this.category = props.category;
    this.questionType = props.questionType;
    this.prompt = props.prompt;
    this.correctAnswer = props.correctAnswer;
    this.options = shuffledOptions;
    this.helperText = props.helperText;
  }

  public static create(props: GrammarPracticeQuestionProps): GrammarPracticeQuestion {
    const shuffledOptions = [props.correctAnswer, props.optionB, props.optionC].sort(() => Math.random() - 0.5);
    return new GrammarPracticeQuestion(props, shuffledOptions);
  }
}