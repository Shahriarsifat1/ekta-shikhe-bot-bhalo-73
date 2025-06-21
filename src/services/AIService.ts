
import { KnowledgeItem } from '@/types/knowledge';
import { KnowledgeStorageService } from './KnowledgeStorageService';
import { KnowledgeSearchService } from './KnowledgeSearchService';
import { FactExtractionService } from './FactExtractionService';
import { QuestionAnalysisService } from './QuestionAnalysisService';
import { ResponseGenerationService } from './ResponseGenerationService';

class AIServiceClass {
  private knowledgeBase: KnowledgeItem[] = [];
  private searchService = new KnowledgeSearchService();

  constructor() {
    this.loadKnowledgeFromStorage();
    this.updateFuseInstance();
  }

  private loadKnowledgeFromStorage() {
    this.knowledgeBase = KnowledgeStorageService.loadKnowledgeFromStorage();
  }

  private saveKnowledgeToStorage() {
    KnowledgeStorageService.saveKnowledgeToStorage(this.knowledgeBase);
  }

  private updateFuseInstance() {
    this.searchService.updateFuseInstance(this.knowledgeBase);
  }

  async learnFromText(title: string, content: string): Promise<void> {
    const newKnowledge = KnowledgeStorageService.createKnowledgeItem(title, content);

    this.knowledgeBase.push(newKnowledge);
    this.saveKnowledgeToStorage();
    this.updateFuseInstance();
    
    console.log('Learned new knowledge with keywords:', newKnowledge);
  }

  async generateResponse(question: string): Promise<string> {
    const relevantKnowledge = this.searchService.findBestMatches(question, this.knowledgeBase);
    
    console.log('Found relevant knowledge:', relevantKnowledge.length);
    
    if (relevantKnowledge.length > 0) {
      // Extract facts from the most relevant knowledge
      const facts = FactExtractionService.extractFactsFromContent(relevantKnowledge[0].content);
      
      // Analyze the question
      const analysis = QuestionAnalysisService.analyzeQuestion(question);
      
      // Try to generate intelligent response first
      const intelligentResponse = ResponseGenerationService.generateIntelligentResponse(question, facts, analysis);
      
      if (intelligentResponse) {
        return intelligentResponse;
      }
      
      // Try with other knowledge sources
      for (const knowledge of relevantKnowledge.slice(1)) {
        const additionalFacts = FactExtractionService.extractFactsFromContent(knowledge.content);
        const response = ResponseGenerationService.generateIntelligentResponse(question, additionalFacts, analysis);
        if (response) {
          return response;
        }
      }
      
      // Fallback to smart response
      return ResponseGenerationService.generateSmartResponse(question, relevantKnowledge);
    }

    return ResponseGenerationService.generateGeneralResponse(question);
  }

  getKnowledgeBase(): KnowledgeItem[] {
    return [...this.knowledgeBase].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  deleteKnowledge(id: string): void {
    this.knowledgeBase = this.knowledgeBase.filter(item => item.id !== id);
    this.saveKnowledgeToStorage();
    this.updateFuseInstance();
  }

  clearKnowledgeBase(): void {
    this.knowledgeBase = [];
    this.saveKnowledgeToStorage();
    this.updateFuseInstance();
  }

  getKnowledgeStats(): { total: number; topics: string[] } {
    return {
      total: this.knowledgeBase.length,
      topics: [...new Set(this.knowledgeBase.map(item => item.title))]
    };
  }
}

export const AIService = new AIServiceClass();
