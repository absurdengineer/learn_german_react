import type { Gender } from '../domain/entities/Vocabulary';

// Gender color mapping for visual memory
export const GENDER_COLORS = {
  'der': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-200',
    name: 'masculine'
  },
  'die': {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-300',
    hover: 'hover:bg-pink-200',
    name: 'feminine'
  },
  'das': {
    bg: 'bg-gray-200',
    text: 'text-gray-900',
    border: 'border-gray-400',
    hover: 'hover:bg-gray-300',
    name: 'neuter'
  },
  'plural': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    hover: 'hover:bg-purple-200',
    name: 'plural'
  }
} as const;

export const getGenderColor = (gender?: Gender) => {
  if (!gender) return GENDER_COLORS['das']; // Default to neuter
  return GENDER_COLORS[gender];
};

export const getGenderIndicator = (gender?: Gender): string => {
  if (!gender) return '';
  return gender;
};

export const getGenderDisplayName = (gender?: Gender): string => {
  if (!gender) return 'neuter';
  return GENDER_COLORS[gender].name;
};
