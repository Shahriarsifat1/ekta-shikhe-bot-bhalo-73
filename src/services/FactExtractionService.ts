
import { ExtractedFact } from '@/types/knowledge';

export class FactExtractionService {
  static extractFactsFromContent(content: string): ExtractedFact[] {
    const facts: ExtractedFact[] = [];
    const sentences = content.split(/[।!?\n]/).filter(s => s.trim().length > 0);
    
    console.log('Extracting facts from content:', content);
    
    sentences.forEach(sentence => {
      const trimmedSentence = sentence.trim();
      
      // Birth location pattern
      const birthLocationPattern = /(.+?)\s+(পশ্চিমবঙ্গের?|বাংলাদেশের?|ভারতের?|ঢাকার?)\s*(.+?)\s*(জেলার?|বিভাগের?|এর?)\s*(.+?)\s*(গ্রামে?|শহরে?|এলাকায়?)\s*(জন্মগ্রহণ|জন্ম)/;
      const birthMatch = trimmedSentence.match(birthLocationPattern);
      
      if (birthMatch) {
        const state = birthMatch[2]?.replace(/র$/, '') || '';
        const district = birthMatch[3] || '';
        const village = birthMatch[5] || '';
        const location = `${state} ${district} জেলার ${village} গ্রামে`;
        
        facts.push({
          type: 'location',
          subject: birthMatch[1]?.trim() || 'তিনি',
          predicate: 'জন্মগ্রহণ করেছেন',
          object: location.trim(),
          confidence: 0.9
        });
      }
      
      // Alternative birth location pattern
      const altBirthPattern = /(জন্মগ্রহণ|জন্ম).+?(.+?)\s*(গ্রামে?|শহরে?|জেলায?)/;
      const altBirthMatch = trimmedSentence.match(altBirthPattern);
      
      if (altBirthMatch && !birthMatch) {
        facts.push({
          type: 'location',
          subject: 'তিনি',
          predicate: 'জন্মগ্রহণ করেছেন',
          object: altBirthMatch[2]?.trim() + ' ' + altBirthMatch[3] || '',
          confidence: 0.7
        });
      }
      
      // Relationship name patterns
      const relationPattern = /(তার|তাঁর|তিনি|এর|তাদের)\s+(বাবার|মাতার|মায়ের|মেয়ের|ছেলের|পিতার|কন্যার|পুত্রের)\s+নাম\s+(.+)/;
      const relationMatch = trimmedSentence.match(relationPattern);
      
      if (relationMatch) {
        facts.push({
          type: 'relationship',
          subject: relationMatch[1],
          predicate: relationMatch[2] + ' নাম',
          object: relationMatch[3].trim(),
          confidence: 0.9
        });
      }
      
      // Birth year pattern
      const birthYearPattern = /(\d{4})\s*সালে?\s*(জন্ম|জন্মগ্রহণ)/;
      const birthYearMatch = trimmedSentence.match(birthYearPattern);
      
      if (birthYearMatch) {
        facts.push({
          type: 'time',
          subject: 'তিনি',
          predicate: 'জন্মগ্রহণ করেছেন',
          object: birthYearMatch[1] + ' সালে',
          confidence: 0.9
        });
      }
      
      // Death year pattern
      const deathYearPattern = /(\d{4})\s*সালে?\s*(মৃত্যু|মারা)/;
      const deathYearMatch = trimmedSentence.match(deathYearPattern);
      
      if (deathYearMatch) {
        facts.push({
          type: 'time',
          subject: 'তিনি',
          predicate: 'মৃত্যুবরণ করেছেন',
          object: deathYearMatch[1] + ' সালে',
          confidence: 0.9
        });
      }
    });
    
    console.log('Extracted facts:', facts);
    return facts;
  }
}
