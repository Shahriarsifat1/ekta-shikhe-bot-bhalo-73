
interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
}

class AIServiceClass {
  private knowledgeBase: KnowledgeItem[] = [];

  constructor() {
    this.loadKnowledgeFromStorage();
  }

  private loadKnowledgeFromStorage() {
    try {
      const stored = localStorage.getItem('ai-knowledge-base');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.knowledgeBase = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  }

  private saveKnowledgeToStorage() {
    try {
      localStorage.setItem('ai-knowledge-base', JSON.stringify(this.knowledgeBase));
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  }

  private extractTags(content: string): string[] {
    // Simple tag extraction based on keywords
    const keywords = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const uniqueKeywords = [...new Set(keywords)];
    return uniqueKeywords.slice(0, 5); // Keep top 5 keywords as tags
  }

  async learnFromText(title: string, content: string): Promise<void> {
    const newKnowledge: KnowledgeItem = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date(),
      tags: this.extractTags(content)
    };

    this.knowledgeBase.push(newKnowledge);
    this.saveKnowledgeToStorage();
    
    console.log('Learned new knowledge:', newKnowledge);
  }

  async generateResponse(question: string): Promise<string> {
    const lowerQuestion = question.toLowerCase();
    
    // Search for relevant knowledge
    const relevantKnowledge = this.knowledgeBase.filter(item => {
      return item.title.toLowerCase().includes(lowerQuestion) ||
             item.content.toLowerCase().includes(lowerQuestion) ||
             item.tags.some(tag => lowerQuestion.includes(tag.toLowerCase()));
    });

    if (relevantKnowledge.length > 0) {
      // Use the most relevant knowledge to answer
      const mostRelevant = relevantKnowledge[0];
      return this.generateContextualResponse(question, mostRelevant);
    }

    // Generate a general response if no specific knowledge found
    return this.generateGeneralResponse(question);
  }

  private generateContextualResponse(question: string, knowledge: KnowledgeItem): string {
    const responses = [
      `আমি "${knowledge.title}" সম্পর্কে যা শিখেছি তার ভিত্তিতে বলতে পারি: ${knowledge.content.substring(0, 300)}...`,
      `"${knowledge.title}" বিষয়ে আমার জ্ঞান অনুযায়ী: ${knowledge.content.substring(0, 250)}...`,
      `আমি এই বিষয়ে শিখেছি যে: ${knowledge.content.substring(0, 200)}... এটি "${knowledge.title}" সম্পর্কিত।`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGeneralResponse(question: string): string {
    const greetings = ['হ্যালো', 'নমস্কার', 'সালাম', 'হাই', 'hello', 'hi'];
    const thanks = ['ধন্যবাদ', 'থ্যাংক', 'thanks', 'thank you'];
    
    if (greetings.some(greeting => question.toLowerCase().includes(greeting))) {
      return "নমস্কার! আমি একটা স্মার্ট AI বট। আপনি আমাকে যেকোনো প্রশ্ন করতে পারেন অথবা নতুন কিছু শেখাতে পারেন।";
    }
    
    if (thanks.some(thank => question.toLowerCase().includes(thank))) {
      return "আপনাকেও ধন্যবাদ! আমি সব সময় আপনাকে সাহায্য করার জন্য এখানে আছি।";
    }

    if (question.includes('?') || question.includes('কী') || question.includes('কিভাবে') || question.includes('কেন')) {
      return `এটি একটি আকর্ষণীয় প্রশ্ন! দুঃখিত, আমার কাছে এই বিষয়ে এখনো পর্যাপ্ত তথ্য নেই। আপনি চাইলে আমাকে এই বিষয়ে কিছু শেখাতে পারেন "শেখান" ট্যাবে গিয়ে।`;
    }

    const generalResponses = [
      "আমি আপনার কথা বুঝতে পারছি। আরও নির্দিষ্ট প্রশ্ন করলে আমি ভালো উত্তর দিতে পারব।",
      "আকর্ষণীয়! আপনি চাইলে আমাকে এই বিষয়ে আরও শেখাতে পারেন।",
      "আমি প্রতিদিন নতুন কিছু শিখছি। আপনার প্রশ্নটি আরেকটু বিস্তারিত করলে ভালো হয়।",
      "আমি আপনাকে সাহায্য করতে চাই। আরও তথ্য দিলে আমি বেশি কার্যকর উত্তর দিতে পারব।"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  getKnowledgeBase(): KnowledgeItem[] {
    return [...this.knowledgeBase].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  deleteKnowledge(id: string): void {
    this.knowledgeBase = this.knowledgeBase.filter(item => item.id !== id);
    this.saveKnowledgeToStorage();
  }

  clearKnowledgeBase(): void {
    this.knowledgeBase = [];
    this.saveKnowledgeToStorage();
  }

  getKnowledgeStats(): { total: number; topics: string[] } {
    return {
      total: this.knowledgeBase.length,
      topics: [...new Set(this.knowledgeBase.map(item => item.title))]
    };
  }
}

export const AIService = new AIServiceClass();
