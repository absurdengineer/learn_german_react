import type { LevelType } from '../../types/User.js';
import { Email, Level, User, UserId, UserPreferences } from '../../types/User.js';
import type { UserRepository } from '../domain/UserRepository.js';

export class LocalStorageUserRepository implements UserRepository {
  private readonly storageKey = 'german-learning-users';

  async findById(id: UserId): Promise<User | null> {
    const users = this.getAllUsers();
    const userData = users.find(u => u.id === id.value);
    return userData ? this.deserializeUser(userData) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = this.getAllUsers();
    const userData = users.find(u => u.email === email);
    return userData ? this.deserializeUser(userData) : null;
  }

  async save(user: User): Promise<void> {
    const users = this.getAllUsers();
    const serializedUser = this.serializeUser(user);
    const existingIndex = users.findIndex(u => u.id === user.id.value);
    
    if (existingIndex >= 0) {
      users[existingIndex] = serializedUser;
    } else {
      users.push(serializedUser);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  async delete(id: UserId): Promise<void> {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== id.value);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers));
  }

  async exists(id: UserId): Promise<boolean> {
    const users = this.getAllUsers();
    return users.some(u => u.id === id.value);
  }

  private getAllUsers(): SerializedUser[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private serializeUser(user: User): SerializedUser {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      currentLevel: user.currentLevel.value,
      createdAt: user.createdAt.toISOString(),
      lastActiveAt: user.lastActiveAt.toISOString(),
      preferences: {
        dailyGoalMinutes: user.preferences.dailyGoalMinutes,
        reminderEnabled: user.preferences.reminderEnabled,
        reminderTime: user.preferences.reminderTime,
        soundEnabled: user.preferences.soundEnabled,
        darkMode: user.preferences.darkMode,
        language: user.preferences.language
      }
    };
  }

  private deserializeUser(data: SerializedUser): User {
    return new User(
      new UserId(data.id),
      data.name,
      new Email(data.email),
      new Level(data.currentLevel as LevelType),
      new Date(data.createdAt),
      new Date(data.lastActiveAt),
      new UserPreferences(data.preferences)
    );
  }
}

interface SerializedUser {
  id: string;
  name: string;
  email: string;
  currentLevel: string;
  createdAt: string;
  lastActiveAt: string;
  preferences: {
    dailyGoalMinutes: number;
    reminderEnabled: boolean;
    reminderTime: string;
    soundEnabled: boolean;
    darkMode: boolean;
    language: string;
  };
}
