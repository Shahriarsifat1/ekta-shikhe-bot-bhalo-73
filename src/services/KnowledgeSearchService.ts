
import Fuse from 'fuse.js';
import { KnowledgeItem } from '@/types/knowledge';
import { BengaliLanguageService } from './BengaliLanguageService';

export class KnowledgeSearchService {
  private fuseInstance: Fuse<KnowledgeItem> | null = null;

  updateFuseInstance(knowledgeBase: KnowledgeItem[]): void {
    if (knowledgeBase.length > 0) {
      const options = {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'content', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
          { name: 'keywords', weight: 0.1 }
        ],
        threshold: 0.4,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true
      };
      
      this.fuseInstance = new Fuse(knowledgeBase, options);
    }
  }

  findBestMatches(question: string, knowledgeBase: KnowledgeItem[]): KnowledgeItem[] {
    const normalizedQuestion = BengaliLanguageService.normalizeText(question);
    
    if (!this.fuseInstance) {
      return [];
    }
    
    const fuseResults = this.fuseInstance.search(normalizedQuestion);
    
    const goodMatches = fuseResults
      .filter(result => result.score! < 0.5)
      .map(result => result.item);
    
    if (goodMatches.length === 0) {
      const questionWords = normalizedQuestion.split(/\s+/).filter(word => word.length > 2);
      const keywordMatches = knowledgeBase.filter(item => {
        const itemText = BengaliLanguageService.normalizeText(`${item.title} ${item.content} ${item.keywords.join(' ')}`);
        return questionWords.some(word => itemText.includes(word));
      });
      
      return keywordMatches.slice(0, 3);
    }
    
    return goodMatches.slice(0, 3);
  }
}
