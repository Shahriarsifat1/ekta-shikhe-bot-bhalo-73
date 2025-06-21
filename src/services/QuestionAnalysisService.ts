
import { QuestionAnalysis } from '@/types/knowledge';
import { BengaliLanguageService } from './BengaliLanguageService';

export class QuestionAnalysisService {
  private static questionPatterns = {
    birth_location: ['কোথায় জন্মগ্রহণ', 'কোথায় জন্ম', 'জন্মস্থান', 'কোন গ্রামে জন্ম', 'কোন জায়গায় জন্ম'],
    death_location: ['কোথায় মৃত্যু', 'কোথায় মারা', 'মৃত্যুস্থান'],
    birth_time: ['কখন জন্মগ্রহণ', 'কখন জন্ম', 'জন্ম সাল', 'কত সালে জন্ম'],
    death_time: ['কখন মৃত্যু', 'কখন মারা', 'মৃত্যু সাল', 'কত সালে মৃত্যু'],
    name: ['নাম কি', 'নাম কী', 'কি নাম', 'কী নাম'],
    father_name: ['বাবার নাম', 'পিতার নাম'],
    mother_name: ['মায়ের নাম', 'মাতার নাম'],
    daughter_name: ['মেয়ের নাম', 'কন্যার নাম'],
    son_name: ['ছেলের নাম', 'পুত্রের নাম'],
    where: ['কোথায়', 'কোন জায়গায়', 'কোন স্থানে', 'কোন দেশে', 'কোন এলাকায়', 'কোন গ্রামে', 'কোন শহরে'],
    when: ['কখন', 'কোন সময়', 'কত সালে', 'কোন বছর', 'কোন তারিখে'],
    what: ['কি', 'কী', 'কোন জিনিস'],
    who: ['কে', 'কার', 'কোন ব্যক্তি'],
    how: ['কিভাবে', 'কেমনে', 'কোন উপায়ে'],
    why: ['কেন', 'কিসের জন্য', 'কোন কারণে']
  };

  static analyzeQuestion(question: string): QuestionAnalysis {
    const normalizedQuestion = BengaliLanguageService.normalizeText(question);
    console.log('Analyzing question:', normalizedQuestion);
    
    // Extract subject from question (person's name)
    const subjectMatch = question.match(/([a-zA-Zআ-হ\s]+)\s+(কোথায়|কখন|কার|কী|কি)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    
    // Determine question type and intent
    for (const [type, patterns] of Object.entries(this.questionPatterns)) {
      for (const pattern of patterns) {
        if (normalizedQuestion.includes(pattern.toLowerCase())) {
          return { type, intent: pattern, subject };
        }
      }
    }
    
    // Fallback analysis
    if (normalizedQuestion.includes('কোথায়')) {
      if (normalizedQuestion.includes('জন্ম')) return { type: 'birth_location', intent: 'জন্মস্থান', subject };
      if (normalizedQuestion.includes('মৃত্যু')) return { type: 'death_location', intent: 'মৃত্যুস্থান', subject };
      return { type: 'where', intent: 'স্থান', subject };
    }
    
    if (normalizedQuestion.includes('কখন')) {
      if (normalizedQuestion.includes('জন্ম')) return { type: 'birth_time', intent: 'জন্মকাল', subject };
      if (normalizedQuestion.includes('মৃত্যু')) return { type: 'death_time', intent: 'মৃত্যুকাল', subject };
      return { type: 'when', intent: 'সময়', subject };
    }
    
    if (normalizedQuestion.includes('নাম')) {
      if (normalizedQuestion.includes('বাবা') || normalizedQuestion.includes('পিতা')) {
        return { type: 'father_name', intent: 'বাবার নাম', subject };
      }
      if (normalizedQuestion.includes('মা') || normalizedQuestion.includes('মাতা')) {
        return { type: 'mother_name', intent: 'মায়ের নাম', subject };
      }
      if (normalizedQuestion.includes('মেয়ে') || normalizedQuestion.includes('কন্যা')) {
        return { type: 'daughter_name', intent: 'মেয়ের নাম', subject };
      }
      if (normalizedQuestion.includes('ছেলে') || normalizedQuestion.includes('পুত্র')) {
        return { type: 'son_name', intent: 'ছেলের নাম', subject };
      }
      return { type: 'name', intent: 'নাম', subject };
    }
    
    return { type: 'general', intent: 'সাধারণ', subject };
  }
}
