import type { Gender } from "../domain/entities/Vocabulary";

// Gender color mapping for visual memory
export const GENDER_COLORS = {
  der: {
    bg: "bg-blue-200",
    text: "text-blue-800",
    border: "border-blue-400",
    hover: "hover:bg-blue-300",
    name: "masculine",
  },
  die: {
    bg: "bg-pink-200",
    text: "text-pink-800",
    border: "border-pink-400",
    hover: "hover:bg-pink-300",
    name: "feminine",
  },
  das: {
    bg: "bg-gray-200",
    text: "text-gray-900",
    border: "border-gray-400",
    hover: "hover:bg-gray-300",
    name: "neuter",
  },
  plural: {
    bg: "bg-purple-200",
    text: "text-purple-800",
    border: "border-purple-400",
    hover: "hover:bg-purple-300",
    name: "plural",
  },
} as const;

export const getGenderColor = (gender?: Gender) => {
  if (!gender) return GENDER_COLORS["das"]; // Default to neuter
  return GENDER_COLORS[gender];
};

export const getGenderIndicator = (gender?: Gender): string => {
  if (!gender) return "";
  return gender;
};

export const getGenderDisplayName = (gender?: Gender): string => {
  if (!gender) return "neuter";
  return GENDER_COLORS[gender].name;
};
