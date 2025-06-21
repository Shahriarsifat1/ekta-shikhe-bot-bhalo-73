
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
  keywords: string[];
}

export interface ExtractedFact {
  type: 'location' | 'time' | 'name' | 'relationship' | 'general';
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export interface QuestionAnalysis {
  type: string;
  intent: string;
  subject?: string;
}
