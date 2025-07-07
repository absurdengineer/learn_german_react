// Value Objects
export class UserId {
  public readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId cannot be empty');
    }
    this.value = value;
  }
}

export class Email {
  public readonly value: string;

  constructor(value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error('Invalid email format');
    }
    this.value = value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export type LevelType = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export class Level {
  private static readonly VALID_LEVELS: LevelType[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  public readonly value: LevelType;
  
  constructor(value: LevelType) {
    if (!Level.VALID_LEVELS.includes(value)) {
      throw new Error(`Invalid level: ${value}`);
    }
    this.value = value;
  }
}

// Domain Entity
export class User {
  public readonly id: UserId;
  public readonly name: string;
  public readonly email: Email;
  public readonly currentLevel: Level;
  public readonly createdAt: Date;
  public readonly lastActiveAt: Date;
  public readonly preferences: UserPreferences;

  constructor(
    id: UserId,
    name: string,
    email: Email,
    currentLevel: Level,
    createdAt: Date,
    lastActiveAt: Date,
    preferences: UserPreferences
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.currentLevel = currentLevel;
    this.createdAt = createdAt;
    this.lastActiveAt = lastActiveAt;
    this.preferences = preferences;
  }

  static create(props: {
    name: string;
    email: string;
    currentLevel: LevelType;
    preferences?: Partial<UserPreferences>;
  }): User {
    return new User(
      new UserId(crypto.randomUUID()),
      props.name,
      new Email(props.email),
      new Level(props.currentLevel),
      new Date(),
      new Date(),
      new UserPreferences(props.preferences || {})
    );
  }

  updateLastActivity(): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.currentLevel,
      this.createdAt,
      new Date(),
      this.preferences
    );
  }

  changeLevel(newLevel: LevelType): User {
    return new User(
      this.id,
      this.name,
      this.email,
      new Level(newLevel),
      this.createdAt,
      this.lastActiveAt,
      this.preferences
    );
  }
}

export class UserPreferences {
  public readonly dailyGoalMinutes: number;
  public readonly reminderEnabled: boolean;
  public readonly reminderTime: string;
  public readonly soundEnabled: boolean;
  public readonly darkMode: boolean;
  public readonly language: string;

  constructor(props: Partial<UserPreferences> = {}) {
    this.dailyGoalMinutes = props.dailyGoalMinutes ?? 30;
    this.reminderEnabled = props.reminderEnabled ?? true;
    this.reminderTime = props.reminderTime ?? '19:00';
    this.soundEnabled = props.soundEnabled ?? true;
    this.darkMode = props.darkMode ?? false;
    this.language = props.language ?? 'en';
  }

  update(changes: Partial<UserPreferences>): UserPreferences {
    return new UserPreferences({
      ...this,
      ...changes
    });
  }
}
