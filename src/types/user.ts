import mongoose, { Document, Model } from 'mongoose';

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
  readonly writings: mongoose.Types.ObjectId[];
};

export type UserAccount = Omit<UserSchema, 'writings'>;

export interface UserDocument extends UserSchema, Document {
  setPassword: (password: string) => Promise<void>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByEmail: (email: string) => Promise<UserDocument>;
}