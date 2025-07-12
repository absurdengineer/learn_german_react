/**
 * Standardized Grammar Practice Parser
 */

import grammarPracticeCSV from '../../data/grammar_practice.csv?raw';
import { BaseCSVParser, DataStandardizer, type StandardizedGrammarPractice } from './DataLoader';

export class GrammarPracticeParser extends BaseCSVParser<StandardizedGrammarPractice> {
  protected csvContent = grammarPracticeCSV;

  protected parseRow(data: Record<string, string>, index: number): StandardizedGrammarPractice | null {
    if (!data.id || !data.prompt || !data.correct_answer) {
      return null;
    }

    const dayReference = parseInt(data.day_reference) || 1;
    const questionType = this.normalizeQuestionType(data.question_type);
    const options = DataStandardizer.parseOptions(
      data.prompt,
      data.correct_answer,
      data.option_b,
      data.option_c
    );

    return {
      id: data.id || DataStandardizer.generateId('grammar_practice', index),
      type: 'grammar_practice',
      dayReference,
      questionType,
      prompt: data.prompt,
      correctAnswer: data.correct_answer,
      options,
      helperText: data.helper_text || undefined,
      category: data.category || this.extractCategoryFromPrompt(data.prompt),
      difficulty: this.calculateDifficulty(dayReference, data.prompt),
      tags: this.extractTags(data.category, data.prompt)
    };
  }

  private normalizeQuestionType(type: string): 'multiple_choice' | 'fill_in_blank' | 'true_false' | 'ordering' {
    const normalized = type.toLowerCase().trim();
    if (normalized.includes('multiple') || normalized.includes('choice')) return 'multiple_choice';
    if (normalized.includes('fill') || normalized.includes('blank')) return 'fill_in_blank';
    if (normalized.includes('true') || normalized.includes('false')) return 'true_false';
    if (normalized.includes('order')) return 'ordering';
    return 'multiple_choice'; // Default
  }

  private extractCategoryFromPrompt(prompt: string): string {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('greet') || promptLower.includes('hallo')) return 'greetings';
    if (promptLower.includes('alphabet') || promptLower.includes('letter')) return 'alphabet';
    if (promptLower.includes('article') || promptLower.includes('der') || promptLower.includes('die') || promptLower.includes('das')) return 'articles';
    if (promptLower.includes('verb') || promptLower.includes('conjugat')) return 'verbs';
    if (promptLower.includes('noun') || promptLower.includes('gender')) return 'nouns';
    if (promptLower.includes('number') || promptLower.includes('zahl')) return 'numbers';
    if (promptLower.includes('pronoun') || promptLower.includes('ich') || promptLower.includes('du')) return 'pronouns';
    if (promptLower.includes('case') || promptLower.includes('accusative') || promptLower.includes('nominative')) return 'cases';

    return 'general';
  }

  private calculateDifficulty(dayReference: number, prompt: string): number {
    let difficulty = Math.ceil(dayReference / 7); // Base difficulty on week

    // Adjust based on content complexity
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('basic') || promptLower.includes('simple')) difficulty = Math.max(1, difficulty - 1);
    if (promptLower.includes('complex') || promptLower.includes('advanced')) difficulty += 1;
    if (promptLower.includes('case') || promptLower.includes('conjugat')) difficulty += 1;

    return Math.min(5, Math.max(1, difficulty)); // Clamp between 1-5
  }

  private extractTags(category: string, prompt: string): string[] {
    const tags = new Set<string>();
    
    if (category) tags.add(category);
    
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('formal')) tags.add('formal');
    if (promptLower.includes('informal')) tags.add('informal');
    if (promptLower.includes('pronunciation')) tags.add('pronunciation');
    if (promptLower.includes('culture')) tags.add('cultural');
    if (promptLower.includes('grammar')) tags.add('grammar');

    return Array.from(tags);
  }
}

// Export singleton instance
export const grammarPracticeLoader = new GrammarPracticeParser();
