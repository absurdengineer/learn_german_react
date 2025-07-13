import { createContext, useContext } from "react";
import type { User, Progress, AppSettings, Achievement } from "../types";

export interface AppState {
  user: User | null;
  progress: Progress | null;
  settings: AppSettings;
  achievements: Achievement[];
  isLoading: boolean;
}

export interface AppAction {
  type: string;
  payload?: any;
}

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
