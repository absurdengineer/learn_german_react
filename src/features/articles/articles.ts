import articlesCSV from "./articles.csv?raw";

export interface ArticleNoun {
  id: string;
  german: string;
  english: string;
  gender: "der" | "die" | "das";
  frequency: number;
  category: string;
  pronunciation?: string;
}

// Memoized cache for parsed articles
let articlesCache: ArticleNoun[] | null = null;

/**
 * Parse and normalize the articles CSV into a typed array of ArticleNoun objects.
 * Memoized for performance.
 */
export function getAllArticles(): ArticleNoun[] {
  if (articlesCache) return articlesCache;
  const lines = articlesCSV.trim().split("\n");
  const headers = lines[0].split(",");
  const articles: ArticleNoun[] = [];
  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(",");
    if (data.length !== headers.length) continue;
    const article: { [key: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      article[headers[j].trim()] = data[j] ? data[j].trim() : "";
    }
    if (!article.german || !article.english || !article.gender) continue;
    articles.push({
      id: article.id || `csv_${i}`,
      german: article.german,
      english: article.english,
      gender: article.gender as "der" | "die" | "das",
      frequency: parseInt(article.frequency, 10) || 1,
      category: article.category || "",
      pronunciation: article.pronunciation || undefined,
    });
  }
  articlesCache = articles;
  return articlesCache;
}

/**
 * Get an article noun by its ID.
 */
export function getArticleById(id: string): ArticleNoun | undefined {
  return getAllArticles().find((a) => a.id === id);
}
