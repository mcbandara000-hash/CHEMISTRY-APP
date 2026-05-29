/**
 * Types and interfaces for the Sri Lankan A/L Inorganic Chemistry Quiz.
 */

export interface Question {
  id: string;
  topic: string; // e.g., 'periodic', 's-block', 'p-block', 'd-block', 'coordination', 'environmental'
  subtopic: string; // e.g., 'Group 15', 'Oxides', 'Transition series'
  question_si: string; // Question text in Sinhala
  options_si: string[]; // 5-option array in Sinhala
  correctIndex: number; // Index 0-4
  explanation_si: string; // Detailed chemistry explanation in Sinhala
  difficulty: "easy" | "medium" | "hard";
  resource_ref: string; // Reference to "අකාබනික සම්පත් පොත" matching syllabus
}

export interface UserStats {
  total_questions_answered: number;
  correct: number;
  accuracy: number;
  topic_stats: {
    [topicId: string]: {
      answered: number;
      correct: number;
    };
  };
}

export interface UserProfile {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  coins: number;
  badges: string[]; // List of badge IDs
  last_active_date: string; // ISO string or YYYY-MM-DD
  stats: UserStats;
  inventory: {
    fiftyFifty: number;
    doubleTime: number;
    skip: number;
  };
}

export interface LeaderboardEntry {
  username: string;
  xp: number;
  level: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  name_si: string;
  description_si: string;
  iconName: string;
  requirementTxt_si: string;
}

export interface Topic {
  id: string;
  name_si: string;
  name_en: string;
  description_si: string;
  questionCount: number;
  color: string; // Tailwind color class
}
