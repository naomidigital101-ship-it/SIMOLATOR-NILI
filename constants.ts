
export enum CharacterType {
  INTERVIEWER = 'INTERVIEWER',
  CUSTOMER = 'CUSTOMER',
  BOSS = 'BOSS'
}

export enum ArenaType {
  HRM = 'HRM',
  SALES = 'SALES',
  COACHING = 'COACHING'
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface Character {
  id: CharacterType;
  level: DifficultyLevel;
  name: string;
  role: string;
  gender: 'male' | 'female';
  avatar: string;
  sceneUrl?: string;
  color: string;
  bgGradient: string;
  description: string;
  situation: string;
  detailedBackground: string;
  specificIssue: string;
  goal: string;
  initialMessage: string;
  responses: string[];
}

export const CHARACTERS: Record<CharacterType, Character> = {
  [CharacterType.INTERVIEWER]: { id: CharacterType.INTERVIEWER, level: DifficultyLevel.BEGINNER, name: '', role: '', gender: 'male', avatar: '', color: '', bgGradient: '', description: '', situation: '', detailedBackground: '', specificIssue: '', goal: '', initialMessage: '', responses: [] },
  [CharacterType.CUSTOMER]: { id: CharacterType.CUSTOMER, level: DifficultyLevel.BEGINNER, name: '', role: '', gender: 'male', avatar: '', color: '', bgGradient: '', description: '', situation: '', detailedBackground: '', specificIssue: '', goal: '', initialMessage: '', responses: [] },
  [CharacterType.BOSS]: { id: CharacterType.BOSS, level: DifficultyLevel.BEGINNER, name: '', role: '', gender: 'male', avatar: '', color: '', bgGradient: '', description: '', situation: '', detailedBackground: '', specificIssue: '', goal: '', initialMessage: '', responses: [] }
};
