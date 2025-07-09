import articlesCSV from './articles.csv?raw';

export interface ArticleNoun {
  id: string;
  german: string;
  english: string;
  gender: 'der' | 'die' | 'das';
  frequency: number;
  category: string;
  pronunciation?: string;
}

export const parseArticlesCSV = (): ArticleNoun[] => {
  const lines = articlesCSV.split('\n');
  const articles: ArticleNoun[] = [];
  const headers = lines[0].split(',');

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(',');
    const article: { [key: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      article[headers[j].trim()] = data[j] ? data[j].trim() : '';
    }
    articles.push({
      id: article.id,
      german: article.german,
      english: article.english,
      gender: article.gender as 'der' | 'die' | 'das',
      frequency: parseInt(article.frequency, 10),
      category: article.category,
      pronunciation: article.pronunciation,
    });
  }

  return articles;
};
