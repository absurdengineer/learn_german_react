import { User, UserId } from '../entities/User.js';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  exists(id: UserId): Promise<boolean>;
}
