import type { Gender } from "../types/Vocabulary";

// Gender color mapping for visual memory
export const GENDER_COLORS = {
  der: {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-600",
    hover: "hover:bg-blue-600",
    name: "masculine",
  },
  die: {
    bg: "bg-pink-500",
    text: "text-white",
    border: "border-pink-600",
    hover: "hover:bg-pink-600",
    name: "feminine",
  },
  das: {
    bg: "bg-gray-500",
    text: "text-white",
    border: "border-gray-600",
    hover: "hover:bg-gray-600",
    name: "neuter",
  },
  plural: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
    hover: "hover:bg-purple-600",
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
