import { UserProgress } from '../../types/Progress.js';
import type { LevelType } from '../../types/User.js';
import { User, UserId } from '../../types/User.js';
import { UserService } from '../domain/UserService.js';

export class CreateUserUseCase {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(request: {
    name: string;
    email: string;
    currentLevel: LevelType;
    dailyGoal?: number;
    weeklyGoal?: number;
  }): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const user = await this.userService.createUser(request);
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetUserUseCase {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const user = await this.userService.getUserById(new UserId(userId));
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class UpdateUserLevelUseCase {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(request: {
    userId: string;
    newLevel: LevelType;
  }): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const user = await this.userService.updateUserLevel(
        new UserId(request.userId),
        request.newLevel
      );
      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export class GetUserWithProgressUseCase {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async execute(userId: string): Promise<{
    success: boolean;
    data?: {
      user: User;
      progress: UserProgress;
    };
    error?: string;
  }> {
    try {
      const result = await this.userService.getUserWithProgress(new UserId(userId));
      if (!result) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
