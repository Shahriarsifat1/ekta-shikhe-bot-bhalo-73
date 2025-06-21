
import { KnowledgeItem } from '@/types/knowledge';
import { BengaliLanguageService } from './BengaliLanguageService';

export class KnowledgeStorageService {
  static loadKnowledgeFromStorage(): KnowledgeItem[] {
    try {
      const stored = localStorage.getItem('ai-knowledge-base');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          keywords: item.keywords || BengaliLanguageService.extractKeywords(item.content)
        }));
      }
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
    return [];
  }

  static saveKnowledgeToStorage(knowledgeBase: KnowledgeItem[]): void {
    try {
      localStorage.setItem('ai-knowledge-base', JSON.stringify(knowledgeBase));
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  static createKnowledgeItem(title: string, content: string): KnowledgeItem {
    const keywords = BengaliLanguageService.extractKeywords(content);
    return {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date(),
      tags: BengaliLanguageService.extractTags(content),
      keywords: keywords
    };
  }
}
