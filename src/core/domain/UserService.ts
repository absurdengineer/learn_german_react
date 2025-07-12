import { UserProgress } from '../../types/Progress.js';
import type { LevelType } from '../../types/User.js';
import { User, UserId } from '../../types/User.js';
import type { ProgressRepository } from './ProgressRepository.js';
import type { UserRepository } from './UserRepository.js';

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly progressRepository: ProgressRepository;

  constructor(
    userRepository: UserRepository,
    progressRepository: ProgressRepository
  ) {
    this.userRepository = userRepository;
    this.progressRepository = progressRepository;
  }

  async createUser(props: {
    name: string;
    email: string;
    currentLevel: LevelType;
    dailyGoal?: number;
    weeklyGoal?: number;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(props.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = User.create({
      name: props.name,
      email: props.email,
      currentLevel: props.currentLevel,
      preferences: {
        dailyGoalMinutes: props.dailyGoal || 30,
      }
    });

    // Save user
    await this.userRepository.save(user);

    // Create initial progress
    await this.progressRepository.createForUser(
      user.id.value,
      props.dailyGoal,
      props.weeklyGoal
    );

    return user;
  }

  async getUserById(userId: UserId): Promise<User | null> {
    return await this.userRepository.findById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async updateUserLevel(userId: UserId, newLevel: LevelType): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = user.changeLevel(newLevel);
    await this.userRepository.save(updatedUser);
    return updatedUser;
  }

  async updateLastActivity(userId: UserId): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = user.updateLastActivity();
    await this.userRepository.save(updatedUser);
    return updatedUser;
  }

  async deleteUser(userId: UserId): Promise<void> {
    const userProgress = await this.progressRepository.findByUserId(userId.value);
    if (userProgress) {
      await this.progressRepository.delete(userProgress.id);
    }
    await this.userRepository.delete(userId);
  }

  async userExists(userId: UserId): Promise<boolean> {
    return await this.userRepository.exists(userId);
  }

  async getUserWithProgress(userId: UserId): Promise<{
    user: User;
    progress: UserProgress;
  } | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }

    const progress = await this.progressRepository.findByUserId(userId.value);
    if (!progress) {
      throw new Error('User progress not found');
    }

    return { user, progress };
  }
}
