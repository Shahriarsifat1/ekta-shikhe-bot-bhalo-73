import Fuse from 'fuse.js';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
  keywords: string[]; // নতুন field
}

class AIServiceClass {
  private knowledgeBase: KnowledgeItem[] = [];
  private fuseInstance: Fuse<KnowledgeItem> | null = null;

  // Bengali to English common word mapping for better understanding
  private bengaliSynonyms: Record<string, string[]> = {
    'কি': ['কী', 'কেমন', 'কোন'],
    'কী': ['কি', 'কেমন', 'কোন'],
    'কে': ['কার', 'কাকে', 'কাহার'],
    'কেন': ['কিসের জন্য', 'কোন কারণে'],
    'কিভাবে': ['কেমনে', 'কিরূপে', 'কোন উপায়ে'],
    'কোথায়': ['কোন জায়গায়', 'কোন স্থানে'],
    'কখন': ['কোন সময়', 'কত সময়'],
    'কত': ['কতটা', 'কেমন'],
    'কোন': ['কোনটা', 'কোনো'],
    'হয়': ['হওয়া', 'হইয়া', 'হল'],
    'করে': ['করা', 'করিয়া', 'করল'],
    'বলে': ['বলা', 'বলিয়া', 'বলল'],
    'দেয়': ['দেওয়া', 'দিয়া', 'দিল'],
    'নেয়': ['নেওয়া', 'নিয়া', 'নিল'],
    'আছে': ['আছিল', 'থাকে', 'রয়েছে'],
    'ছিল': ['ছিলো', 'ছাইল', 'আছিল'],
    'মৃত্যুবরণ': ['মারা যান', 'মৃত্যু', 'মরে যান', 'ইন্তেকাল'],
    'জন্মগ্রহণ': ['জন্ম', 'জন্মায়', 'জন্মেছিলেন']
  };

  // Enhanced question patterns for better understanding
  private questionPatterns = {
    where: ['কোথায়', 'কোন জায়গায়', 'কোন স্থানে', 'কোন দেশে', 'কোন এলাকায়'],
    when: ['কখন', 'কোন সময়', 'কত সালে', 'কোন বছর'],
    what: ['কি', 'কী', 'কোন জিনিস'],
    who: ['কে', 'কার', 'কোন ব্যক্তি'],
    how: ['কিভাবে', 'কেমনে', 'কোন উপায়ে'],
    why: ['কেন', 'কিসের জন্য', 'কোন কারণে']
  };

  constructor() {
    this.loadKnowledgeFromStorage();
    this.updateFuseInstance();
  }

  private loadKnowledgeFromStorage() {
    try {
      const stored = localStorage.getItem('ai-knowledge-base');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.knowledgeBase = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          keywords: item.keywords || this.extractKeywords(item.content)
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
    const keywords = content.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const uniqueKeywords = [...new Set(keywords)];
    return uniqueKeywords.slice(0, 5);
  }

  private extractKeywords(content: string): string[] {
    // Enhanced keyword extraction
    const words = content.toLowerCase()
      .replace(/[।,;:!?\-()]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Remove common stop words
    const stopWords = ['এবং', 'বা', 'কিন্তু', 'তবে', 'যদি', 'তাহলে', 'এই', 'সেই', 'যে', 'যা', 'যার', 'তার', 'এর', 'সে', 'তা', 'এটা', 'ওটা', 'একটি', 'একটা', 'কোনো', 'কোন'];
    const filteredWords = words.filter(word => !stopWords.includes(word));
    
    return [...new Set(filteredWords)];
  }

  private updateFuseInstance() {
    if (this.knowledgeBase.length > 0) {
      const options = {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'content', weight: 0.3 },
          { name: 'tags', weight: 0.2 },
          { name: 'keywords', weight: 0.1 }
        ],
        threshold: 0.3, // More strict matching for better accuracy
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2,
        ignoreLocation: true
      };
      
      this.fuseInstance = new Fuse(this.knowledgeBase, options);
    }
  }

  private normalizeText(text: string): string {
    let normalized = text.toLowerCase().trim();
    
    // Handle Bengali synonyms
    Object.entries(this.bengaliSynonyms).forEach(([key, synonyms]) => {
      synonyms.forEach(synonym => {
        const regex = new RegExp(`\\b${synonym}\\b`, 'g');
        normalized = normalized.replace(regex, key);
      });
    });
    
    // Simple spelling correction for common mistakes
    const spellingCorrections: Record<string, string> = {
      'করতে': 'করে',
      'বলতে': 'বলে',
      'নিতে': 'নেয়',
      'দিতে': 'দেয়',
      'হতে': 'হয়',
      'যেতে': 'যায়',
      'আসতে': 'আসে'
    };
    
    Object.entries(spellingCorrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'g');
      normalized = normalized.replace(regex, correct);
    });
    
    return normalized;
  }

  private analyzeQuestionType(question: string): { type: string; keywords: string[] } {
    const normalizedQuestion = this.normalizeText(question);
    const questionWords = normalizedQuestion.split(/\s+/);
    
    // Extract key question words and main subject
    const keyWords: string[] = [];
    let questionType = 'general';
    
    // Determine question type
    for (const [type, patterns] of Object.entries(this.questionPatterns)) {
      if (patterns.some(pattern => questionWords.includes(pattern))) {
        questionType = type;
        break;
      }
    }
    
    // Extract important keywords (excluding question words)
    const questionPatternWords = Object.values(this.questionPatterns).flat();
    questionWords.forEach(word => {
      if (word.length > 2 && !questionPatternWords.includes(word)) {
        keyWords.push(word);
      }
    });
    
    return { type: questionType, keywords: keyWords };
  }

  private extractSpecificAnswer(content: string, questionType: string, keywords: string[]): string {
    const sentences = content.split(/[।!?]/).filter(s => s.trim().length > 0);
    
    // Find the most relevant sentence based on question type and keywords
    let bestSentence = '';
    let maxRelevance = 0;
    
    for (const sentence of sentences) {
      const sentenceNormalized = this.normalizeText(sentence);
      let relevance = 0;
      
      // Check for keyword matches
      keywords.forEach(keyword => {
        if (sentenceNormalized.includes(keyword)) {
          relevance += 2;
        }
      });
      
      // Add specific relevance based on question type
      switch (questionType) {
        case 'where':
          if (sentenceNormalized.includes('বাংলাদেশে') || 
              sentenceNormalized.includes('পশ্চিমবঙ্গে') ||
              sentenceNormalized.includes('ঢাকায়') ||
              sentenceNormalized.includes('কলকাতায়') ||
              /\b\w+ে\b/.test(sentenceNormalized)) {
            relevance += 5;
          }
          break;
        case 'when':
          if (/\d{4}/.test(sentence) || 
              sentenceNormalized.includes('সালে') ||
              sentenceNormalized.includes('সময়ে')) {
            relevance += 5;
          }
          break;
        case 'what':
          if (sentenceNormalized.includes('তিনি') || 
              sentenceNormalized.includes('যিনি')) {
            relevance += 3;
          }
          break;
      }
      
      if (relevance > maxRelevance) {
        maxRelevance = relevance;
        bestSentence = sentence.trim();
      }
    }
    
    return bestSentence || sentences[0]?.trim() || '';
  }

  private generatePreciseAnswer(question: string, knowledgeItem: KnowledgeItem): string {
    const questionAnalysis = this.analyzeQuestionType(question);
    const { type: questionType, keywords } = questionAnalysis;
    
    console.log('Question analysis:', questionAnalysis);
    
    // Extract the most relevant part of content
    const relevantSentence = this.extractSpecificAnswer(
      knowledgeItem.content, 
      questionType, 
      keywords
    );
    
    // Generate precise answer based on question type
    switch (questionType) {
      case 'where':
        // Look for specific location information
        const locationMatch = relevantSentence.match(/(বাংলাদেশে?|পশ্চিমবঙ্গে?|ঢাকায়?|কলকাতায়?|\w+ে)\s*(মৃত্যুবরণ|মারা|জন্ম|জন্মগ্রহণ)?/);
        if (locationMatch) {
          const location = locationMatch[1];
          if (question.includes('মৃত্যু') || question.includes('মারা')) {
            return location === 'বাংলাদেশে' ? 'বাংলাদেশে' : location;
          }
          if (question.includes('জন্ম')) {
            return location;
          }
          return location;
        }
        
        // Fallback: if exact location not found, look in the sentence
        if (relevantSentence.includes('বাংলাদেশে')) return 'বাংলাদেশে';
        if (relevantSentence.includes('পশ্চিমবঙ্গ')) return 'পশ্চিমবঙ্গে';
        break;
        
      case 'when':
        const yearMatch = relevantSentence.match(/(\d{4})/);
        if (yearMatch) {
          return yearMatch[1] + ' সালে';
        }
        break;
        
      case 'what':
        // For "what" questions, provide a concise definition
        const titleParts = knowledgeItem.title.split(' ');
        if (titleParts.length > 2) {
          return titleParts.slice(1).join(' '); // Remove the name, keep the description
        }
        break;
        
      case 'who':
        // Extract the main description about the person
        const descriptionMatch = relevantSentence.match(/যিনি\s+"([^"]+)"/);
        if (descriptionMatch) {
          return descriptionMatch[1];
        }
        break;
    }
    
    // If no specific answer found, return the most relevant sentence (shortened)
    if (relevantSentence) {
      // Keep it under 100 characters for conciseness
      return relevantSentence.length > 100 
        ? relevantSentence.substring(0, 100) + '...'
        : relevantSentence;
    }
    
    return "দুঃখিত, এই প্রশ্নের সুনির্দিষ্ট উত্তর খুঁজে পাইনি।";
  }

  private findBestMatches(question: string): KnowledgeItem[] {
    const normalizedQuestion = this.normalizeText(question);
    
    if (!this.fuseInstance) {
      return [];
    }
    
    // Use Fuse.js for fuzzy search with higher accuracy
    const fuseResults = this.fuseInstance.search(normalizedQuestion);
    
    // Filter results with better scores
    const goodMatches = fuseResults
      .filter(result => result.score! < 0.4) // Only good matches
      .map(result => result.item);
    
    // Also do traditional keyword matching as fallback
    if (goodMatches.length === 0) {
      const questionWords = normalizedQuestion.split(/\s+/).filter(word => word.length > 2);
      const keywordMatches = this.knowledgeBase.filter(item => {
        const itemText = this.normalizeText(`${item.title} ${item.content} ${item.keywords.join(' ')}`);
        return questionWords.some(word => itemText.includes(word));
      });
      
      return keywordMatches.slice(0, 2);
    }
    
    return goodMatches.slice(0, 2); // Top 2 matches
  }

  async learnFromText(title: string, content: string): Promise<void> {
    const keywords = this.extractKeywords(content);
    const newKnowledge: KnowledgeItem = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date(),
      tags: this.extractTags(content),
      keywords: keywords
    };

    this.knowledgeBase.push(newKnowledge);
    this.saveKnowledgeToStorage();
    this.updateFuseInstance();
    
    console.log('Learned new knowledge with keywords:', newKnowledge);
  }

  async generateResponse(question: string): Promise<string> {
    const normalizedQuestion = this.normalizeText(question);
    
    // Find the best matching knowledge items
    const relevantKnowledge = this.findBestMatches(question);
    
    if (relevantKnowledge.length > 0) {
      // Try to generate a precise answer first
      const preciseAnswer = this.generatePreciseAnswer(question, relevantKnowledge[0]);
      if (preciseAnswer && preciseAnswer !== "দুঃখিত, এই প্রশ্নের সুনির্দিষ্ট উত্তর খুঁজে পাইনি।") {
        return preciseAnswer;
      }
      
      // Fallback to smart response if precise answer not found
      return this.generateSmartResponse(question, relevantKnowledge);
    }

    // Generate a general response if no specific knowledge found
    return this.generateGeneralResponse(question);
  }

  private generateSmartResponse(question: string, knowledgeItems: KnowledgeItem[]): string {
    const questionWords = this.normalizeText(question).split(/\s+/);
    const isWhatQuestion = questionWords.some(word => ['কি', 'কী', 'কোন'].includes(word));
    const isHowQuestion = questionWords.some(word => ['কিভাবে', 'কেমনে'].includes(word));
    const isWhyQuestion = questionWords.some(word => ['কেন', 'কিসের'].includes(word));
    const isWhereQuestion = questionWords.some(word => ['কোথায়', 'কোন'].includes(word));
    const isWhenQuestion = questionWords.some(word => ['কখন', 'কত'].includes(word));
    
    // Use the most relevant knowledge
    const primaryKnowledge = knowledgeItems[0];
    
    // Extract relevant part of content based on question type
    let responseContent = primaryKnowledge.content;
    
    // Try to find specific sentences that might answer the question
    const sentences = primaryKnowledge.content.split(/[।!?]/);
    const relevantSentences = sentences.filter(sentence => {
      const sentenceNormalized = this.normalizeText(sentence);
      return questionWords.some(word => 
        word.length > 2 && sentenceNormalized.includes(word)
      );
    });
    
    if (relevantSentences.length > 0) {
      responseContent = relevantSentences.join('। ') + '।';
    }
    
    // Generate contextual response based on question type
    if (isWhatQuestion) {
      return `"${primaryKnowledge.title}" সম্পর্কে আমি জানি যে: ${responseContent.substring(0, 400)}${responseContent.length > 400 ? '...' : ''}`;
    } else if (isHowQuestion) {
      return `"${primaryKnowledge.title}" সম্পর্কিত প্রক্রিয়া হলো: ${responseContent.substring(0, 400)}${responseContent.length > 400 ? '...' : ''}`;
    } else if (isWhyQuestion) {
      return `"${primaryKnowledge.title}" এর কারণ: ${responseContent.substring(0, 400)}${responseContent.length > 400 ? '...' : ''}`;
    } else if (isWhereQuestion) {
      return `"${primaryKnowledge.title}" সম্পর্কে স্থান/অবস্থান: ${responseContent.substring(0, 400)}${responseContent.length > 400 ? '...' : ''}`;
    } else if (isWhenQuestion) {
      return `"${primaryKnowledge.title}" এর সময়কাল: ${responseContent.substring(0, 400)}${responseContent.length > 400 ? '...' : ''}`;
    }
    
    // Default response with multiple knowledge sources
    let response = `আপনার প্রশ্নের উত্তরে আমি বলতে পারি:\n\n`;
    response += `"${primaryKnowledge.title}" থেকে: ${responseContent.substring(0, 300)}${responseContent.length > 300 ? '...' : ''}`;
    
    if (knowledgeItems.length > 1) {
      response += `\n\nঅতিরিক্ত তথ্য "${knowledgeItems[1].title}" থেকে: ${knowledgeItems[1].content.substring(0, 200)}...`;
    }
    
    return response;
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
      return `এটি একটি আকর্ষণীয় প্রশ্ন! দুঃখিত, আমার কাছে এই বিষয়ে এখনো পর্যাপ্ত তথ্য নেই। আপনি চাইলে আমাকে এই বিষয়ে কিছু শেখাতে পারেন "শেখান" ট্যাবে গিয়ে। আমি এখন আরও স্মার্ট হয়েছি এবং সরাসরি উত্তর দিতে পারি।`;
    }

    const generalResponses = [
      "আমি আপনার কথা বুঝতে পারছি। আমি এখন ChatGPT ও Gemini এর মতো স্মার্ট হয়েছি এবং সংক্ষিপ্ত, সঠিক উত্তর দিতে পারি।",
      "আকর্ষণীয়! আপনি চাইলে আমাকে এই বিষয়ে আরও শেখাতে পারেন। আমি এখন প্রসঙ্গ বুঝে নির্দিষ্ট উত্তর দিতে পারি।",
      "আমি প্রতিদিন নতুন কিছু শিখছি এবং আরও বুদ্ধিমান হচ্ছি। এখন আমি প্রশ্নের মূল অর্থ বুঝে সরাসরি উত্তর দিতে পারি।",
      "আমি আপনাকে সাহায্য করতে চাই। আমার নতুন AI ক্ষমতা দিয়ে আমি সংক্ষিপ্ত এবং নির্ভুল উত্তর দিতে পারব।"
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
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
