
import { ExtractedFact, QuestionAnalysis, KnowledgeItem } from '@/types/knowledge';
import { BengaliLanguageService } from './BengaliLanguageService';

export class ResponseGenerationService {
  static generateIntelligentResponse(question: string, facts: ExtractedFact[], analysis: QuestionAnalysis): string | null {
    console.log('Question analysis:', analysis);
    console.log('Available facts:', facts);
    
    // Find the most relevant fact based on question type
    let relevantFact: ExtractedFact | null = null;
    
    switch (analysis.type) {
      case 'birth_location':
        relevantFact = facts.find(f => 
          f.type === 'location' && 
          f.predicate.includes('জন্মগ্রহণ')
        ) || null;
        break;
        
      case 'death_location':
        relevantFact = facts.find(f => 
          f.type === 'location' && 
          f.predicate.includes('মৃত্যু')
        ) || null;
        break;
        
      case 'birth_time':
        relevantFact = facts.find(f => 
          f.type === 'time' && 
          f.predicate.includes('জন্মগ্রহণ')
        ) || null;
        break;
        
      case 'death_time':
        relevantFact = facts.find(f => 
          f.type === 'time' && 
          f.predicate.includes('মৃত্যু')
        ) || null;
        break;
        
      case 'father_name':
        relevantFact = facts.find(f => 
          f.type === 'relationship' && 
          f.predicate.includes('বাবার নাম')
        ) || null;
        break;
        
      case 'mother_name':
        relevantFact = facts.find(f => 
          f.type === 'relationship' && 
          f.predicate.includes('মায়ের নাম')
        ) || null;
        break;
        
      case 'daughter_name':
        relevantFact = facts.find(f => 
          f.type === 'relationship' && 
          f.predicate.includes('মেয়ের নাম')
        ) || null;
        break;
        
      case 'son_name':
        relevantFact = facts.find(f => 
          f.type === 'relationship' && 
          f.predicate.includes('ছেলের নাম')
        ) || null;
        break;
    }
    
    // Generate natural language response
    if (relevantFact) {
      const subjectName = analysis.subject || relevantFact.subject;
      
      switch (analysis.type) {
        case 'birth_location':
          return `${subjectName} ${relevantFact.object} জন্মগ্রহণ করেছেন।`;
          
        case 'death_location':
          return `${subjectName} ${relevantFact.object} মৃত্যুবরণ করেছেন।`;
          
        case 'birth_time':
          return `${subjectName} ${relevantFact.object} জন্মগ্রহণ করেছেন।`;
          
        case 'death_time':
          return `${subjectName} ${relevantFact.object} মৃত্যুবরণ করেছেন।`;
          
        case 'father_name':
          return `${subjectName}এর বাবার নাম ${relevantFact.object}।`;
          
        case 'mother_name':
          return `${subjectName}এর মায়ের নাম ${relevantFact.object}।`;
          
        case 'daughter_name':
          return `${subjectName}এর মেয়ের নাম ${relevantFact.object}।`;
          
        case 'son_name':
          return `${subjectName}এর ছেলের নাম ${relevantFact.object}।`;
          
        default:
          return `${subjectName} সম্পর্কে: ${relevantFact.object}।`;
      }
    }
    
    return null;
  }

  static generateSmartResponse(question: string, knowledgeItems: KnowledgeItem[]): string {
    const questionWords = BengaliLanguageService.normalizeText(question).split(/\s+/);
    const isWhatQuestion = questionWords.some(word => ['কি', 'কী', 'কোন'].includes(word));
    const isHowQuestion = questionWords.some(word => ['কিভাবে', 'কেমনে'].includes(word));
    const isWhyQuestion = questionWords.some(word => ['কেন', 'কিসের'].includes(word));
    const isWhereQuestion = questionWords.some(word => ['কোথায়', 'কোন'].includes(word));
    const isWhenQuestion = questionWords.some(word => ['কখন', 'কত'].includes(word));
    
    const primaryKnowledge = knowledgeItems[0];
    
    let responseContent = primaryKnowledge.content;
    
    const sentences = primaryKnowledge.content.split(/[।!?]/);
    const relevantSentences = sentences.filter(sentence => {
      const sentenceNormalized = BengaliLanguageService.normalizeText(sentence);
      return questionWords.some(word => 
        word.length > 2 && sentenceNormalized.includes(word)
      );
    });
    
    if (relevantSentences.length > 0) {
      responseContent = relevantSentences.join('। ') + '।';
    }
    
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
    
    let response = `আপনার প্রশ্নের উত্তরে আমি বলতে পারি:\n\n`;
    response += `"${primaryKnowledge.title}" থেকে: ${responseContent.substring(0, 300)}${responseContent.length > 300 ? '...' : ''}`;
    
    if (knowledgeItems.length > 1) {
      response += `\n\nঅতিরিক্ত তথ্য "${knowledgeItems[1].title}" থেকে: ${knowledgeItems[1].content.substring(0, 200)}...`;
    }
    
    return response;
  }

  static generateGeneralResponse(question: string): string {
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
}
