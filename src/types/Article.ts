export interface ArticleNoun {
  id: string;
  german: string;
  english: string;
  gender: 'der' | 'die' | 'das';
  category: string;
  frequency: number;
  pronunciation?: string;
}
