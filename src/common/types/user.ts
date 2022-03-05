import { Document, Model } from 'mongoose';
import { ObjectId } from './mongoose';

export type UserResponse = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly token: string;
};

export type UserSchema = {
  readonly email: string;
  readonly name: string;
  password: string;
  writings: ObjectId[];
};

export type UserAccount = Omit<UserSchema, 'writings'>;

export interface UserDocument extends UserSchema, Document {
  setPassword: (password: string) => Promise<void>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface UserRepository {
  findByEmail: (email: string) => Promise<UserDocument>;
  createNewUser: (user: UserAccount) => Promise<UserDocument>;
  addWriting: (userId: ObjectId, writingId: ObjectId) => void;
  deleteWriting: (userId: string, writingId: string) => Promise<void>;
}

export type UserModel = Model<UserDocument> & UserRepository;
